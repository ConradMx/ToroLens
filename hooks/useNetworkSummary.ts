'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNetworkSummary } from '@/libs/toronet/client';

export function useNetworkSummary(count = 10) {
  const query = useQuery({
    queryKey: ['network', 'summary', count],
    queryFn: () => fetchNetworkSummary(count),
    staleTime: 30_000,
  });

  return {
    snapshot: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
