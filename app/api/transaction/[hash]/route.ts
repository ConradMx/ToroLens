import { getTransactionDetails } from '@/libs/toronet/queries';
import { apiErrorResponse } from '@/libs/server/api';
import { enforceRateLimit } from '@/libs/server/rate-limit';
import { transactionHashSchema } from '@/libs/server/validation';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  context: RouteContext<'/api/transaction/[hash]'>,
) {
  try {
    enforceRateLimit(request, 'transaction-details');
    const { hash } = await context.params;
    const data = await getTransactionDetails(transactionHashSchema.parse(hash));
    return Response.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
