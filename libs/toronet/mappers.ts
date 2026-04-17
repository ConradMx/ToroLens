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
      record.status ?? record.accountStatus ?? record.role,
      'Connected to Toronet',
    ),
    label: toStringValue(record.label ?? record.username ?? record.name, ''),
    isKycVerified:
      record.isKycVerified === true || record.kycVerified === true,
  };
}

export function mapBalances(payload: unknown): BalanceItem[] {
  const record = (payload ?? {}) as Record<string, unknown>;

  return [
    {
      symbol: 'TNGN',
      value: toStringValue(
        record.ngnBalance ?? record.tngnBalance ?? record.bal_naira ?? '--',
      ),
    },
    {
      symbol: 'TUSD',
      value: toStringValue(
        record.usdBalance ?? record.tusdBalance ?? record.bal_dollar ?? '--',
      ),
    },
    {
      symbol: 'TORO',
      value: toStringValue(
        record.toroGBalance ??
          record.torogBalance ??
          record.bal_toro ??
          record.bal_auth ??
          '--',
      ),
    },
  ];
}

export function mapTransactionList(payload: unknown): TransactionItem[] {
  if (!Array.isArray(payload)) return [];

  return payload.map((item, index) => {
    const record = item as Record<string, unknown>;

    return {
      hash: toStringValue(
        record.hash ??
          record.txhash ??
          record.txHash ??
          record.EV_Hash ??
          `unknown-${index}`,
      ),
      type: toType(
        record.type ?? record.action ?? record.method ?? record.EV_Event,
      ),
      status: toStatus(
        record.status ?? record.state ?? record.result ?? 'success',
      ),
      date: formatDate(
        record.date ?? record.timestamp ?? record.time ?? record.EV_Time,
      ),
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

  const from = toStringValue(
    txRecord.from ?? txRecord.sender ?? txRecord.TX_From,
    '--',
  );
  const to = toStringValue(txRecord.to ?? txRecord.receiver ?? txRecord.TX_To, '--');

  const status = toStatus(
    receiptRecord.status ?? txRecord.status ?? txRecord.state ?? txRecord.TX_Status,
  );

  const rawError = toStringValue(
    receiptRecord.message ??
      txRecord.rawError ??
      txRecord.error ??
      txRecord.TX_Error,
    '',
  );

  const revertReason = input.revertReason || '';

  return {
    hash: input.hash,
    type: toType(
      txRecord.type ?? txRecord.action ?? txRecord.method ?? txRecord.TX_Type,
    ),
    status,
    date: formatDate(
      txRecord.date ??
        txRecord.timestamp ??
        receiptRecord.timestamp ??
        txRecord.TX_Time,
    ),
    from,
    to,
    amount: toStringValue(
      txRecord.amount ?? txRecord.value ?? txRecord.TX_Value,
      '--',
    ),
    asset: toStringValue(
      txRecord.asset ?? txRecord.currency ?? txRecord.TX_Asset ?? 'TORO',
    ),
    fee: toStringValue(
      txRecord.fee ?? receiptRecord.gasUsed ?? txRecord.TX_Fee,
      '--',
    ),
    blockNumber: toStringValue(
      txRecord.blockNumber ??
        txRecord.block ??
        receiptRecord.blockNumber ??
        txRecord.TX_BlockNumber,
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
