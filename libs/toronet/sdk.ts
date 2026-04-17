import { config } from '@/libs/config';

const DEFAULT_TX_COUNT = 20;

function getBaseUrl() {
  if (config.toroApiUrl) {
    return config.toroApiUrl;
  }

  return config.toroNetwork === 'mainnet'
    ? 'https://api.toronet.org'
    : 'https://testnet.toronet.org/api';
}

function getEndpoint(path: 'query' | 'tns') {
  return `${getBaseUrl()}/${path}`;
}

function buildSearchParams(
  op: string,
  params: Array<{ name: string; value: string | number }>,
) {
  const search = new URLSearchParams();
  search.set('op', op);

  params.forEach((param, index) => {
    search.set(`params[${index}][name]`, param.name);
    search.set(`params[${index}][value]`, String(param.value));
  });

  return search.toString();
}

async function requestToronet<T>({
  op,
  params,
  path,
}: {
  op: string;
  params: Array<{ name: string; value: string | number }>;
  path?: 'query' | 'tns';
}) {
  const url = `${getEndpoint(path ?? 'query')}?${buildSearchParams(op, params)}`;
  const response = await fetch(url, {
    method: 'GET',
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`Toronet request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as
    | T
    | { result?: boolean; error?: string; message?: string };

  if (
    typeof payload === 'object' &&
    payload !== null &&
    'result' in payload &&
    payload.result === false
  ) {
    const message =
      ('error' in payload && typeof payload.error === 'string' && payload.error) ||
      ('message' in payload &&
        typeof payload.message === 'string' &&
        payload.message) ||
      'Toronet request failed.';

    throw new Error(message);
  }

  return payload as T;
}

export async function fetchWalletBalances(address: string) {
  return requestToronet<{
    is_toro?: boolean;
    bal_toro?: string | number;
    is_eth?: boolean;
    bal_eth?: string | number;
    is_dollar?: boolean;
    bal_dollar?: string | number;
    is_naira?: boolean;
    bal_naira?: string | number;
    is_euro?: boolean;
    bal_euro?: string | number;
    is_pound?: boolean;
    bal_pound?: string | number;
    is_egp?: boolean;
    bal_egp?: string | number;
    is_ksh?: boolean;
    bal_ksh?: string | number;
    is_zar?: boolean;
    bal_zar?: string | number;
    is_espees?: boolean;
    bal_espees?: string | number;
    is_plast?: boolean;
    bal_plast?: string | number;
    result?: boolean;
    message?: string;
  }>({
    op: 'getaddrbalance',
    params: [{ name: 'addr', value: address }],
  });
}

export async function fetchWalletTransactions(
  address: string,
  count = DEFAULT_TX_COUNT,
) {
  const response = await requestToronet<{
    data?: unknown[];
    result?: boolean;
    message?: string;
  }>({
    op: 'getaddrtransactions',
    params: [
      { name: 'addr', value: address },
      { name: 'count', value: count },
    ],
  });

  return Array.isArray(response.data) ? response.data : [];
}

export async function fetchWalletRole(address: string) {
  return requestToronet<{
    role?: string;
    result?: boolean;
    message?: string;
  }>({
    op: 'getaddrrole',
    params: [{ name: 'addr', value: address }],
  });
}

export async function fetchWalletName(address: string) {
  return requestToronet<{
    name?: string;
    result?: boolean;
    message?: string;
  }>({
    path: 'tns',
    op: 'getname',
    params: [{ name: 'addr', value: address }],
  });
}

export async function fetchTransaction(hash: string) {
  const response = await requestToronet<{
    data?: unknown;
    result?: boolean;
    message?: string;
  }>({
    op: 'gettransaction',
    params: [{ name: 'hash', value: hash }],
  });

  return response.data ?? null;
}
