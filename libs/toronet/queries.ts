import {
  mapBalances,
  mapWalletSummary,
  mapTransactionDetails,
  mapTransactionList,
} from '@/libs/toronet/mappers';
import {
  fetchWalletBalances,
  fetchTransaction,
  fetchWalletName,
  fetchWalletRole,
  fetchWalletTransactions,
} from '@/libs/toronet/sdk';

export async function getWalletOverview(address: string) {
  const [balances, role, name] = await Promise.all([
    fetchWalletBalances(address),
    fetchWalletRole(address).catch(() => null),
    fetchWalletName(address).catch(() => null),
  ]);

  return {
    summary: mapWalletSummary(address, {
      ...balances,
      role: role?.role,
      name: name?.name,
    }),
    balances: mapBalances(balances),
  };
}

export async function getWalletTransactions(address: string, count = 20) {
  const payload = await fetchWalletTransactions(address, count);
  return mapTransactionList(payload);
}

export async function getTransactionDetails(hash: string) {
  const tx = await fetchTransaction(hash);

  return mapTransactionDetails({
    hash,
    tx,
    receipt: undefined,
    revertReason: '',
  });
}
