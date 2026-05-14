export type WalletSummary = {
  address: string;
  status: string;
  label?: string;
  isKycVerified?: boolean;
  isEnrolled?: boolean;
  role?: string;
};

export type BalanceItem = {
  symbol: string;
  value: string;
};

export type WalletPermission = {
  label: string;
  value: string;
  description: string;
};

export type WalletInsight = {
  label: string;
  value: string;
  description: string;
};
