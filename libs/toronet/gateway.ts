import {
  getAddressBalance,
  getAddressRole,
  getAddressTransactions,
  getBlockchainStatus,
  getBlockchainTransactions,
  getLatestBlockData,
  getName,
  getReceipt,
  getRevertReason,
  getTransaction,
  initializeSDK,
  isAddressKYCVerified,
  isEnrolled,
} from 'torosdk';
import { config } from '@/libs/config';
import { ToronetError, classifyToronetError } from '@/libs/toronet/errors';

const DEFAULT_TX_COUNT = 20;
let initialized = false;

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
    return withToronetBoundary('getTransaction', () => getTransaction(hash));
  },

  getReceipt(hash: string) {
    return withToronetBoundary('getReceipt', () => getReceipt(hash));
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
