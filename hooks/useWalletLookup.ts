'use client';

import { useQuery } from '@tanstack/react-query';
import { getWalletOverview } from '@/libs/toronet/queries';

function isValidWalletAddress(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}

export function useWalletLookup(walletAddress: string) {
  const isValid = isValidWalletAddress(walletAddress);

  const query = useQuery({
    queryKey: ['wallet', 'overview', walletAddress],
    enabled: isValid,
    queryFn: () => getWalletOverview(walletAddress),
  });

  return {
    summary: query.data?.summary ?? null,
    balances: query.data?.balances ?? [],
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    isValidAddress: isValid,
  };
}