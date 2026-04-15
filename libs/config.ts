export const config = {
  toroNetwork:
    process.env.NEXT_PUBLIC_TORO_NETWORK === 'mainnet'
      ? 'mainnet'
      : 'testnet',
};