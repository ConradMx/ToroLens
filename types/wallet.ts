export type WalletSummary = {
  address: string;
  status: string;
  label?: string;
  isKycVerified?: boolean;
};

export type BalanceItem = {
  symbol: string;
  value: string;
};