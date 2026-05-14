import { getWalletTransactions } from '@/libs/toronet/queries';
import { apiErrorResponse } from '@/libs/server/api';
import { enforceRateLimit } from '@/libs/server/rate-limit';
import { countSchema, walletAddressSchema } from '@/libs/server/validation';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    enforceRateLimit(request, 'wallet-transactions');
    const { searchParams } = new URL(request.url);
    const address = walletAddressSchema.parse(searchParams.get('address') ?? '');
    const count = countSchema.parse(searchParams.get('count') ?? undefined);
    const data = await getWalletTransactions(address, count);
    return Response.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
