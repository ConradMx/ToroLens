export type TransactionStatus = 'success' | 'pending' | 'failed' | 'unknown';

export type TransactionType =
  | 'Transfer'
  | 'Deposit'
  | 'Claim'
  | 'Withdrawal'
  | 'Payment'
  | 'Unknown';

export type TransactionItem = {
  hash: string;
  type: TransactionType;
  status: TransactionStatus;
  date: string;
};

export type TransactionDetails = TransactionItem & {
  from: string;
  to: string;
  amount: string;
  asset: string;
  fee: string;
  blockNumber: string;
  network: string;
  rawError?: string;
  revertReason?: string;
  humanExplanation?: string;
};