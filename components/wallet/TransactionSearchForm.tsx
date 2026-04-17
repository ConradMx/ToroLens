'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Search } from 'lucide-react';

type TransactionSearchFormProps = {
  onSubmit: (hash: string) => void;
  isLoading?: boolean;
};

function validateTransactionHash(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return 'Transaction hash is required.';
  }

  if (!/^0x[a-fA-F0-9]{64}$/.test(trimmed)) {
    return 'Enter a valid 0x-prefixed 64-character transaction hash.';
  }

  return null;
}

export default function TransactionSearchForm({
  onSubmit,
  isLoading = false,
}: TransactionSearchFormProps) {
  const [hash, setHash] = useState('');
  const [touched, setTouched] = useState(false);

  const validationError = useMemo(() => {
    if (!touched) return null;
    return validateTransactionHash(hash);
  }, [hash, touched]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    const error = validateTransactionHash(hash);
    if (error) return;

    onSubmit(hash.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="transactionHash"
          className="block text-sm font-medium text-slate-700"
        >
          Transaction Hash
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <input
              id="transactionHash"
              name="transactionHash"
              type="text"
              placeholder="Paste a transaction hash"
              value={hash}
              onChange={(event) => setHash(event.target.value)}
              onBlur={() => setTouched(true)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Search size={16} />
            {isLoading ? 'Opening...' : 'Inspect Transaction'}
          </button>
        </div>

        {validationError ? (
          <p className="text-sm text-red-600">{validationError}</p>
        ) : (
          <p className="text-sm text-slate-500">
            Open a transaction directly by hash to inspect its details, receipt,
            and failure insight.
          </p>
        )}
      </div>
    </form>
  );
}