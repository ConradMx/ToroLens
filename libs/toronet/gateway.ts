import {
  getAddressBalance,
  getAddressRole,
  getAddressTransactions,
  getBlockchainStatus,
  getBlockchainTransactions,
  getLatestBlockData,
  getName,
  getRevertReason,
  getTransactionById,
  getTransactionReceiptById,
  initializeSDK,
  isAddressKYCVerified,
  isEnrolled,
} from 'torosdk';
import { config } from '@/libs/config';
import { ToronetError, classifyToronetError } from '@/libs/toronet/errors';

const DEFAULT_TX_COUNT = 20;
let initialized = false;

function getFallbackBaseUrl() {
  if (config.toroApiUrl) return config.toroApiUrl;
  return config.toroNetwork === 'mainnet'
    ? 'https://api.toronet.org'
    : 'https://testnet.toronet.org/api';
}

function buildSearchParams(
  op: string,
  params: Array<{ name: string; value: string | number }>,
) {
  const search = new URLSearchParams({ op });

  params.forEach((param, index) => {
    search.set(`params[${index}][name]`, param.name);
    search.set(`params[${index}][value]`, String(param.value));
  });

  return search.toString();
}

function isFailurePayload(payload: unknown) {
  if (!payload || typeof payload !== 'object') return false;
  const record = payload as Record<string, unknown>;
  return (
    record.result === false ||
    (typeof record.message === 'string' &&
      record.message.toLowerCase().includes('missing'))
  );
}

function configureSdk() {
  if (initialized) return;

  // ToroLens keeps SDK configuration server-side so API keys, custom base URLs,
  // and future network credentials never leak into the browser bundle.
  initializeSDK({
    network: config.toroNetwork,
    ...(config.toroApiUrl ? { baseURL: config.toroApiUrl } : {}),
  });

  initialized = true;
}

async function withToronetBoundary<T>(
  operation: string,
  callback: () => Promise<T>,
): Promise<T> {
  configureSdk();

  try {
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(
          new ToronetError({
            kind: 'timeout',
            status: 504,
            message: `${operation} timed out while waiting for Toronet.`,
          }),
        );
      }, config.toroRequestTimeoutMs);
    });

    return await Promise.race([callback(), timeout]);
  } catch (error) {
    throw classifyToronetError(error);
  }
}

async function optional<T>(callback: () => Promise<T>): Promise<T | null> {
  try {
    return await callback();
  } catch {
    return null;
  }
}

async function directQueryFallback<T>(
  op: string,
  params: Array<{ name: string; value: string | number }>,
): Promise<T> {
  const url = `${getFallbackBaseUrl()}/query?${buildSearchParams(op, params)}`;
  const response = await fetch(url, {
    method: 'GET',
    signal: AbortSignal.timeout(config.toroRequestTimeoutMs),
  });

  if (!response.ok) {
    throw new ToronetError({
      kind: 'upstream',
      status: 502,
      message: `Toronet fallback request failed with status ${response.status}.`,
    });
  }

  const payload = (await response.json()) as T;

  if (isFailurePayload(payload)) {
    const message =
      typeof (payload as Record<string, unknown>).message === 'string'
        ? ((payload as Record<string, unknown>).message as string)
        : 'Toronet fallback returned an unsuccessful result.';

    throw new ToronetError({
      kind: 'upstream',
      status: 502,
      message,
    });
  }

  return payload;
}

// This gateway is the only supported Toronet integration boundary in ToroLens.
// Prefer adding SDK-backed methods here over importing torosdk in routes or UI.
export const toronetGateway = {
  getWalletBalances(address: string) {
    return withToronetBoundary('getAddressBalance', () =>
      getAddressBalance({ address }),
    );
  },

  getWalletTransactions(address: string, count = DEFAULT_TX_COUNT) {
    return withToronetBoundary('getAddressTransactions', async () => {
      const response = await getAddressTransactions(address, count);
      return Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];
    });
  },

  getWalletRole(address: string) {
    return withToronetBoundary('getAddressRole', () => getAddressRole(address));
  },

  getWalletName(address: string) {
    return withToronetBoundary('getName', () => getName({ address }));
  },

  getWalletEnrollment(address: string) {
    return withToronetBoundary('isEnrolled', () => isEnrolled({ address }));
  },

  getWalletKyc(address: string) {
    return withToronetBoundary('isAddressKYCVerified', () =>
      isAddressKYCVerified({ address }),
    );
  },

  getTransaction(hash: string) {
    return withToronetBoundary('getTransactionById', async () => {
      const sdkPayload = await optional(() => getTransactionById(hash));

      if (sdkPayload && !isFailurePayload(sdkPayload)) {
        return sdkPayload;
      }

      // SDK v0.2.0 sends the query transaction identifier as `id`, while the
      // testnet query endpoint currently expects `hash`. Keep that workaround
      // isolated here so routes and UI remain SDK-first and easy to replace.
      return directQueryFallback('gettransaction', [
        { name: 'hash', value: hash },
      ]);
    });
  },

  getReceipt(hash: string) {
    return withToronetBoundary('getTransactionReceiptById', async () => {
      const sdkPayload = await optional(() => getTransactionReceiptById(hash));

      if (sdkPayload && !isFailurePayload(sdkPayload)) {
        return sdkPayload;
      }

      // See getTransaction: this fallback exists only for the SDK/query
      // parameter-name mismatch and should be removed once SDK support aligns.
      return directQueryFallback('gettransactionreceipt', [
        { name: 'hash', value: hash },
      ]);
    });
  },

  getRevertReason(hash: string) {
    return withToronetBoundary('getRevertReason', () => getRevertReason(hash));
  },

  getNetworkSnapshot(count = DEFAULT_TX_COUNT) {
    return withToronetBoundary('networkSnapshot', async () => {
      const [status, latestBlock, transactions] = await Promise.all([
        optional(() => getBlockchainStatus()),
        optional(() => getLatestBlockData()),
        optional(() => getBlockchainTransactions(count)),
      ]);

      return { status, latestBlock, transactions };
    });
  },
};

export type ToronetGateway = typeof toronetGateway;
