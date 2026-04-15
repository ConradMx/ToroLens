import { explainTransactionFailure } from '@/libs/toronet/errors';
import type {
  TransactionDetails,
  TransactionItem,
  TransactionStatus,
  TransactionType,
} from '@/types/transaction';
import type { BalanceItem, WalletSummary } from '@/types/wallet';

function toStringValue(value: unknown, fallback = ''): string {
  if (value == null) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function formatDate(value: unknown): string {
  if (typeof value === 'string' && value.trim()) return value;

  if (typeof value === 'number') {
    const millis = value > 1_000_000_000_000 ? value : value * 1000;
    return new Date(millis).toLocaleString();
  }

  return '--';
}

function toStatus(value: unknown): TransactionStatus {
  if (typeof value === 'boolean') {
    return value ? 'success' : 'failed';
  }

  const normalized = toStringValue(value).toLowerCase();

  if (
    normalized.includes('success') ||
    normalized === 'ok' ||
    normalized === 'confirmed' ||
    normalized === 'true'
  ) {
    return 'success';
  }

  if (
    normalized.includes('pend') ||
    normalized.includes('process') ||
    normalized.includes('queue')
  ) {
    return 'pending';
  }

  if (
    normalized.includes('fail') ||
    normalized.includes('revert') ||
    normalized.includes('error') ||
    normalized === 'false'
  ) {
    return 'failed';
  }

  return 'unknown';
}

function toType(value: unknown): TransactionType {
  const normalized = toStringValue(value).toLowerCase();

  if (normalized.includes('deposit')) return 'Deposit';
  if (normalized.includes('withdraw')) return 'Withdrawal';
  if (normalized.includes('claim')) return 'Claim';
  if (normalized.includes('payment')) return 'Payment';
  if (normalized.includes('transfer') || normalized.includes('send')) {
    return 'Transfer';
  }

  return 'Unknown';
}

export function mapWalletSummary(
  address: string,
  payload: unknown,
): WalletSummary {
  const record = (payload ?? {}) as Record<string, unknown>;

  return {
    address,
    status: toStringValue(
      record.status ?? record.accountStatus,
      'Connected to Toronet',
    ),
    label: toStringValue(record.label ?? record.username, ''),
    isKycVerified:
      record.isKycVerified === true || record.kycVerified === true,
  };
}

export function mapBalances(payload: unknown): BalanceItem[] {
  const record = (payload ?? {}) as Record<string, unknown>;

  return [
    {
      symbol: 'TNGN',
      value: toStringValue(record.ngnBalance ?? record.tngnBalance ?? '--'),
    },
    {
      symbol: 'TUSD',
      value: toStringValue(record.usdBalance ?? record.tusdBalance ?? '--'),
    },
    {
      symbol: 'ToroG',
      value: toStringValue(record.toroGBalance ?? record.torogBalance ?? '--'),
    },
  ];
}

export function mapTransactionList(payload: unknown): TransactionItem[] {
  if (!Array.isArray(payload)) return [];

  return payload.map((item, index) => {
    const record = item as Record<string, unknown>;

    return {
      hash: toStringValue(
        record.hash ?? record.txhash ?? record.txHash ?? `unknown-${index}`,
      ),
      type: toType(record.type ?? record.action ?? record.method),
      status: toStatus(record.status ?? record.state ?? record.result),
      date: formatDate(record.date ?? record.timestamp ?? record.time),
    };
  });
}

export function mapTransactionDetails(input: {
  hash: string;
  tx: unknown;
  receipt?: unknown;
  revertReason?: string;
}): TransactionDetails {
  const txRecord = (input.tx ?? {}) as Record<string, unknown>;
  const receiptRecord = (input.receipt ?? {}) as Record<string, unknown>;

  const from = toStringValue(txRecord.from ?? txRecord.sender, '--');
  const to = toStringValue(txRecord.to ?? txRecord.receiver, '--');

  const status = toStatus(
    receiptRecord.status ?? txRecord.status ?? txRecord.state,
  );

  const rawError = toStringValue(
    receiptRecord.message ?? txRecord.rawError ?? txRecord.error,
    '',
  );

  const revertReason = input.revertReason || '';

  return {
    hash: input.hash,
    type: toType(txRecord.type ?? txRecord.action ?? txRecord.method),
    status,
    date: formatDate(
      txRecord.date ?? txRecord.timestamp ?? receiptRecord.timestamp,
    ),
    from,
    to,
    amount: toStringValue(txRecord.amount ?? txRecord.value, '--'),
    asset: toStringValue(txRecord.asset ?? txRecord.currency ?? 'TORO'),
    fee: toStringValue(txRecord.fee ?? receiptRecord.gasUsed, '--'),
    blockNumber: toStringValue(
      txRecord.blockNumber ?? txRecord.block ?? receiptRecord.blockNumber,
      '--',
    ),
    network: toStringValue(txRecord.network, 'Toronet'),
    rawError,
    revertReason,
    humanExplanation: explainTransactionFailure({
      status,
      from: from === '--' ? undefined : from,
      to: to === '--' ? undefined : to,
      rawError,
      revertReason,
    }),
  };
}