import { useQuery } from '@tanstack/react-query';
import { fetchTransactionDetails } from '@/libs/toronet/client';

function isValidTransactionHash(value: string) {
  return /^0x[a-fA-F0-9]{64}$/.test(value.trim());
}

export function useTransactionDetails(hash: string) {
  const isValidHash = isValidTransactionHash(hash);

  const query = useQuery({
    queryKey: ['transaction', 'details', hash],
    queryFn: () => fetchTransactionDetails(hash),
    enabled: isValidHash,
  });

  return {
    transaction: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    isValidHash,
  };
}
