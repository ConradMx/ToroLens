function normalizeBaseUrl(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed.replace(/\/+$/, '');
}

const configuredNetwork =
  process.env.NEXT_PUBLIC_TORO_NETWORK ??
  process.env.NEXT_PUBLIC_TORONET_NETWORK;
const toroNetwork: 'mainnet' | 'testnet' =
  configuredNetwork === 'mainnet' ? 'mainnet' : 'testnet';

export const config = {
  toroNetwork,
  toroApiUrl: normalizeBaseUrl(
    process.env.TORO_API_URL ?? process.env.NEXT_PUBLIC_TORO_API_URL,
  ),
  toroRequestTimeoutMs: Number.parseInt(
    process.env.TORO_REQUEST_TIMEOUT_MS ?? '15000',
    10,
  ),
  toroRateLimitWindowMs: Number.parseInt(
    process.env.TORO_RATE_LIMIT_WINDOW_MS ?? '60000',
    10,
  ),
  toroRateLimitMax: Number.parseInt(
    process.env.TORO_RATE_LIMIT_MAX ?? '60',
    10,
  ),
};
