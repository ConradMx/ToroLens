import { getWalletOverview } from '@/libs/toronet/queries';

export const runtime = 'nodejs';

function isValidWalletAddress(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address')?.trim() ?? '';

  if (!isValidWalletAddress(address)) {
    return Response.json(
      { error: 'A valid wallet address is required.' },
      { status: 400 },
    );
  }

  try {
    const data = await getWalletOverview(address);
    return Response.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to fetch wallet overview.';

    return Response.json({ error: message }, { status: 502 });
  }
}
