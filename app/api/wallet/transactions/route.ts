import { getWalletTransactions } from '@/libs/toronet/queries';

export const runtime = 'nodejs';

const DEFAULT_COUNT = 20;
const MAX_COUNT = 100;

function isValidWalletAddress(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}

function getCount(value: string | null) {
  const parsed = Number.parseInt(value ?? '', 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_COUNT;
  }

  return Math.min(parsed, MAX_COUNT);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address')?.trim() ?? '';
  const count = getCount(searchParams.get('count'));

  if (!isValidWalletAddress(address)) {
    return Response.json(
      { error: 'A valid wallet address is required.' },
      { status: 400 },
    );
  }

  try {
    const data = await getWalletTransactions(address, count);
    return Response.json(data);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unable to fetch wallet transactions.';

    return Response.json({ error: message }, { status: 502 });
  }
}
