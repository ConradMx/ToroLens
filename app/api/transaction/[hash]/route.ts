import { getTransactionDetails } from '@/libs/toronet/queries';

export const runtime = 'nodejs';

function isValidTransactionHash(value: string) {
  return /^0x[a-fA-F0-9]{64}$/.test(value.trim());
}

export async function GET(
  _request: Request,
  context: RouteContext<'/api/transaction/[hash]'>,
) {
  const { hash } = await context.params;

  if (!isValidTransactionHash(hash)) {
    return Response.json(
      { error: 'A valid transaction hash is required.' },
      { status: 400 },
    );
  }

  try {
    const data = await getTransactionDetails(hash);
    return Response.json(data);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unable to fetch transaction details.';

    return Response.json({ error: message }, { status: 502 });
  }
}
