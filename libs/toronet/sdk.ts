import {
  getAddressBalance,
  getAddressTransactions,
  initializeSDK,
  type Network,
} from 'torosdk';
import { config } from '@/libs/config';

const DEFAULT_TX_COUNT = 20;

let initialized = false;

function getNetwork(): Network {
  return config.toroNetwork === 'mainnet' ? 'mainnet' : 'testnet';
}

export function ensureSDKInitialized() {
  if (initialized) return;

  initializeSDK({ network: getNetwork() });
  initialized = true;
}

export async function fetchWalletBalances(address: string) {
  ensureSDKInitialized();

  return getAddressBalance({ address });
}

export async function fetchWalletTransactions(
  address: string,
  count = DEFAULT_TX_COUNT,
) {
  ensureSDKInitialized();

  return getAddressTransactions(address, count);
}