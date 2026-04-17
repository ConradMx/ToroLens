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

export const config = {
  toroNetwork: configuredNetwork === 'mainnet' ? 'mainnet' : 'testnet',
  toroApiUrl: normalizeBaseUrl(
    process.env.TORO_API_URL ?? process.env.NEXT_PUBLIC_TORO_API_URL,
  ),
};
