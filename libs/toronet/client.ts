async function readJson<T>(response: Response): Promise<T> {
  if (response.ok) {
    return (await response.json()) as T;
  }

  let message = 'Request failed.';

  try {
    const payload = (await response.json()) as { error?: string; code?: string };
    if (payload.error) {
      message = payload.code ? `${payload.error} (${payload.code})` : payload.error;
    }
  } catch {
    // Ignore invalid error payloads and fall back to the generic message.
  }

  throw new Error(message);
}

export async function fetchWalletOverview(address: string) {
  const params = new URLSearchParams({ address });
  const response = await fetch(`/api/wallet/overview?${params.toString()}`);

  return readJson<Awaited<ReturnType<typeof import('@/libs/toronet/queries').getWalletOverview>>>(response);
}

export async function fetchWalletTransactions(address: string, count = 20) {
  const params = new URLSearchParams({
    address,
    count: String(count),
  });
  const response = await fetch(`/api/wallet/transactions?${params.toString()}`);

  return readJson<Awaited<ReturnType<typeof import('@/libs/toronet/queries').getWalletTransactions>>>(response);
}

export async function fetchTransactionDetails(hash: string) {
  const response = await fetch(`/api/transaction/${encodeURIComponent(hash)}`);

  return readJson<Awaited<ReturnType<typeof import('@/libs/toronet/queries').getTransactionDetails>>>(response);
}

export async function fetchNetworkSummary(count = 10) {
  const params = new URLSearchParams({ count: String(count) });
  const response = await fetch(`/api/network/summary?${params.toString()}`);

  return readJson<Awaited<ReturnType<typeof import('@/libs/toronet/queries').getNetworkSnapshot>>>(response);
}
