import { explainTransactionFailure } from '@/libs/toronet/errors';
import type {
  NetworkSnapshot,
  TransactionDetails,
  TransactionItem,
  TransactionStatus,
  TransactionType,
} from '@/types/transaction';
import type {
  BalanceItem,
  WalletInsight,
  WalletPermission,
  WalletSummary,
} from '@/types/wallet';

function toStringValue(value: unknown, fallback = ''): string {
  if (value == null) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function toBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value;
  const normalized = toStringValue(value).toLowerCase();
  if (['true', 'yes', '1', 'verified', 'enrolled'].includes(normalized)) {
    return true;
  }
  if (['false', 'no', '0', 'unverified', 'not enrolled'].includes(normalized)) {
    return false;
  }
  return undefined;
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

function toErrorText(value: unknown): string {
  const text = toStringValue(value, '');
  const normalized = text.toLowerCase();

  if (
    normalized.includes('error') ||
    normalized.includes('fail') ||
    normalized.includes('revert') ||
    normalized.includes('missing') ||
    normalized.includes('invalid')
  ) {
    return text;
  }

  return '';
}

export function mapWalletSummary(
  address: string,
  payload: unknown,
): WalletSummary {
  const record = (payload ?? {}) as Record<string, unknown>;
  const role = toStringValue(record.role ?? record.accountRole, '');

  return {
    address,
    status: toStringValue(
      record.status ?? record.accountStatus ?? role,
      'Connected to Toronet',
    ),
    label: toStringValue(record.label ?? record.username ?? record.name, ''),
    role,
    isEnrolled: toBoolean(record.enrolled ?? record.isEnrolled),
    isKycVerified: toBoolean(record.isKycVerified ?? record.kycVerified),
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
  const to = toStringValue(
    txRecord.to ?? txRecord.receiver ?? txRecord.TX_To,
    '--',
  );
  const status = toStatus(
    receiptRecord.status ??
      txRecord.status ??
      txRecord.state ??
      txRecord.TX_Status,
  );
  const rawError = toErrorText(
    receiptRecord.message ??
      txRecord.rawError ??
      txRecord.error ??
      txRecord.TX_Error,
    
  );
  const revertReason = input.revertReason || '';
  const blockNumber = toStringValue(
    txRecord.blockNumber ??
      txRecord.block ??
      receiptRecord.blockNumber ??
      txRecord.TX_BlockNumber,
    '--',
  );
  const asset = toStringValue(
    txRecord.asset ?? txRecord.currency ?? txRecord.TX_Asset ?? 'TORO',
  );

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
    asset,
    fee: toStringValue(
      txRecord.fee ?? receiptRecord.gasUsed ?? txRecord.TX_Fee,
      '--',
    ),
    blockNumber,
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
    timeline: [
      {
        label: 'Submitted',
        value: formatDate(txRecord.date ?? txRecord.timestamp ?? txRecord.TX_Time),
      },
      { label: 'Block', value: blockNumber },
      { label: 'Status', value: status },
    ],
    relatedEntities: [
      { label: 'Sender', value: from },
      { label: 'Recipient', value: to },
      { label: 'Asset', value: asset },
    ],
  };
}

export function mapWalletPermissions(summary: WalletSummary): WalletPermission[] {
  return [
    {
      label: 'Role',
      value: summary.role || 'Unavailable',
      description:
        'Role data comes from Toronet account metadata and helps builders gate administrative or privileged flows.',
    },
    {
      label: 'Enrollment',
      value:
        summary.isEnrolled === undefined
          ? 'Unavailable'
          : summary.isEnrolled
            ? 'Enrolled'
            : 'Not enrolled',
      description:
        'Enrollment determines whether the wallet is recognized for Toronet-native account behavior.',
    },
    {
      label: 'Identity',
      value: summary.label ? 'TNS associated' : 'No TNS name returned',
      description:
        'TNS information is resolved through the SDK and normalized before it reaches the UI.',
    },
  ];
}

export function mapWalletInsights(
  balances: BalanceItem[],
  transactions: TransactionItem[],
): WalletInsight[] {
  const activeBalances = balances.filter((balance) => balance.value !== '--');
  const failures = transactions.filter((tx) => tx.status === 'failed').length;

  return [
    {
      label: 'Assets visible',
      value: String(activeBalances.length),
      description:
        'Number of normalized Toronet asset balances returned for this wallet.',
    },
    {
      label: 'Recent activity',
      value: String(transactions.length),
      description:
        'Transactions loaded through the gateway for the current inspection window.',
    },
    {
      label: 'Recent failures',
      value: String(failures),
      description:
        'Failed transactions are surfaced so users can inspect probable causes.',
    },
  ];
}

export function mapNetworkSnapshot(payload: unknown): NetworkSnapshot {
  const record = (payload ?? {}) as Record<string, unknown>;
  const latestBlock = (record.latestBlock ?? {}) as Record<string, unknown>;
  const transactionPayload = record.transactions as
    | Record<string, unknown>
    | unknown[]
    | undefined;
  const transactions = Array.isArray(transactionPayload)
    ? mapTransactionList(transactionPayload)
    : mapTransactionList(transactionPayload?.data);

  return {
    status: toStringValue(record.status, 'Available'),
    latestBlock: toStringValue(
      latestBlock.number ?? latestBlock.blockNumber ?? latestBlock.id,
      '--',
    ),
    latestBlockTime: formatDate(latestBlock.timestamp ?? latestBlock.time),
    recentTransactionCount: transactions.length,
    recentTransactions: transactions,
  };
}
