'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

type WalletSearchFormProps = {
  onSubmit: (walletAddress: string) => void;
  isLoading?: boolean;
  initialValue?: string;
};

function validateWalletAddress(value: string): string | null {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 'Wallet address is required.';
  }

  if (trimmedValue.length < 8) {
    return 'Wallet address looks too short.';
  }

  return null;
}

export default function WalletSearchForm({
  onSubmit,
  isLoading = false,
  initialValue = '',
}: WalletSearchFormProps) {
  const [walletAddress, setWalletAddress] = useState(initialValue);
  const [touched, setTouched] = useState(false);

  const validationError = useMemo(() => {
    if (!touched) return null;
    return validateWalletAddress(walletAddress);
  }, [touched, walletAddress]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    const error = validateWalletAddress(walletAddress);
    if (error) return;

    onSubmit(walletAddress.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/80 p-4 sm:grid-cols-[auto_1fr] sm:items-center">
        <Sparkles className="size-5 text-indigo-500" />
        <p className="text-sm text-indigo-800">
          Tip: paste the full address for the most accurate transaction and
          failure analysis.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="walletAddress"
          className="block text-sm font-medium text-slate-700"
        >
          Wallet Address
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <input
              id="walletAddress"
              name="walletAddress"
              type="text"
              placeholder="Enter a wallet address to inspect"
              value={walletAddress}
              onChange={(event) => setWalletAddress(event.target.value)}
              onBlur={() => setTouched(true)}
                     className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
           className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Search size={16} />
            {isLoading ? 'Inspecting...' : 'Inspect Wallet'}
          </button>
        </div>

        {validationError ? (
        <p className="text-sm text-rose-600">{validationError}</p>
        ) : (
          <p className="text-sm text-slate-500">
            Enter a wallet address to view balances, transaction activity, and
            failure insights.
          </p>
        )}
      </div>
    </form>
  );
}