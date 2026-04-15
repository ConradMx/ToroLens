import {
  mapBalances,
  mapWalletSummary,
  mapTransactionDetails,
  mapTransactionList,
} from '@/libs/toronet/mappers';
import {
      ensureSDKInitialized,
  fetchWalletBalances,
  fetchWalletTransactions,
} from '@/libs/toronet/sdk';
import { getReceipt, getRevertReason, getTransaction } from 'torosdk';





export async function getWalletOverview(address: string) {
  const payload = await fetchWalletBalances(address);

  return {
    summary: mapWalletSummary(address, payload),
    balances: mapBalances(payload),
  };
}

export async function getWalletTransactions(address: string, count = 20) {
  const payload = await fetchWalletTransactions(address, count);
  return mapTransactionList(payload);
}

export async function getTransactionDetails(hash: string) {
  ensureSDKInitialized();

  const [tx, receipt, revertReason] = await Promise.all([
    getTransaction(hash),
    getReceipt(hash),
    getRevertReason(hash).catch(() => ''), // Revert reason might not be available for all transactions
  ]);

  return mapTransactionDetails({
    hash,
    tx,
    receipt,
    revertReason: typeof revertReason === 'string' ? revertReason : '',
  });
}

