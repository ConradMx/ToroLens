export function shortenHash(hash: string): string {
  if (!hash) return '';
  if (hash.length <= 12) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-4)}`;
}

export function shortenAddress(address: string): string {
  if (!address) return '';
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}