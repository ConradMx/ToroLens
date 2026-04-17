'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchWalletTransactions } from '@/libs/toronet/client';

function isValidWalletAddress(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}

export function useWalletTransactions(address: string, count = 20) {
  const isValidAddress = isValidWalletAddress(address);

  const query = useQuery({
    queryKey: ['wallet', 'transactions', address, count],
    queryFn: () => fetchWalletTransactions(address, count),
    enabled: isValidAddress,
  });

  return {
    transactions: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    isValidAddress,
  };
}
