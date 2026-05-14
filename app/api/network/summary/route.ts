import { getNetworkSnapshot } from '@/libs/toronet/queries';
import { apiErrorResponse } from '@/libs/server/api';
import { enforceRateLimit } from '@/libs/server/rate-limit';
import { countSchema } from '@/libs/server/validation';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    enforceRateLimit(request, 'network-summary');
    const { searchParams } = new URL(request.url);
    const count = countSchema.parse(searchParams.get('count') ?? 10);
    const data = await getNetworkSnapshot(count);
    return Response.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
