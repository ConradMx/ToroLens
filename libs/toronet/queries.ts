import {
  mapBalances,
  mapNetworkSnapshot,
  mapTransactionDetails,
  mapTransactionList,
  mapWalletInsights,
  mapWalletPermissions,
  mapWalletSummary,
} from '@/libs/toronet/mappers';
import { toronetGateway } from '@/libs/toronet/gateway';

export async function getWalletOverview(address: string) {
  const [balances, role, name, enrolled, kyc, transactions] = await Promise.all([
    toronetGateway.getWalletBalances(address),
    toronetGateway.getWalletRole(address).catch(() => null),
    toronetGateway.getWalletName(address).catch(() => null),
    toronetGateway.getWalletEnrollment(address).catch(() => null),
    toronetGateway.getWalletKyc(address).catch(() => null),
    toronetGateway.getWalletTransactions(address, 20).catch(() => []),
  ]);

  const normalizedBalances = mapBalances(balances);
  const summary = mapWalletSummary(address, {
    ...((balances ?? {}) as Record<string, unknown>),
    role: (role as { role?: unknown })?.role ?? role,
    name: (name as { name?: unknown })?.name ?? name,
    enrolled: (enrolled as { result?: unknown })?.result ?? enrolled,
    isKycVerified: (kyc as { result?: unknown })?.result ?? kyc,
  });
  const normalizedTransactions = mapTransactionList(transactions);

  return {
    summary,
    balances: normalizedBalances,
    permissions: mapWalletPermissions(summary),
    insights: mapWalletInsights(normalizedBalances, normalizedTransactions),
  };
}

export async function getWalletTransactions(address: string, count = 20) {
  const payload = await toronetGateway.getWalletTransactions(address, count);
  return mapTransactionList(payload);
}

export async function getTransactionDetails(hash: string) {
  const [tx, receipt, revertReason] = await Promise.all([
    toronetGateway.getTransaction(hash),
    toronetGateway.getReceipt(hash).catch(() => null),
    toronetGateway.getRevertReason(hash).catch(() => ''),
  ]);

  return mapTransactionDetails({
    hash,
    tx: (tx as { data?: unknown })?.data ?? tx,
    receipt,
    revertReason: typeof revertReason === 'string' ? revertReason : '',
  });
}

export async function getNetworkSnapshot(count = 10) {
  const payload = await toronetGateway.getNetworkSnapshot(count);
  return mapNetworkSnapshot(payload);
}
