import { useQuery } from '@tanstack/react-query';
import { getTransactionDetails } from '@/libs/toronet/queries';

function isValidTransactionHash(value: string) {
  return /^0x[a-fA-F0-9]{64}$/.test(value.trim());
}

export function useTransactionDetails(hash: string) {
  const isValidHash = isValidTransactionHash(hash);

  const query = useQuery({
    queryKey: ['transaction', 'details', hash],
    queryFn: () => getTransactionDetails(hash),
    enabled: isValidHash,
  });

  return {
    transaction: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    isValidHash,
  };
}