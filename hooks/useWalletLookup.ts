'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchWalletOverview } from '@/libs/toronet/client';

function isValidWalletAddress(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}

export function useWalletLookup(walletAddress: string) {
  const isValid = isValidWalletAddress(walletAddress);

  const query = useQuery({
    queryKey: ['wallet', 'overview', walletAddress],
    enabled: isValid,
    queryFn: () => fetchWalletOverview(walletAddress),
  });

  return {
    summary: query.data?.summary ?? null,
    balances: query.data?.balances ?? [],
    permissions: query.data?.permissions ?? [],
    insights: query.data?.insights ?? [],
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    isValidAddress: isValid,
  };
}
