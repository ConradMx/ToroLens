'use client';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import SectionCard from '@/components/ui/SectionCard';
import ErrorState from '@/components/ui/ErrorState';
import WalletSearchForm from '@/components/wallet/WalletSearchForm';
import WalletSummaryCard from '@/components/wallet/WalletSummaryCard';
import BalanceCards from '@/components/wallet/BalanceCards';
import TransactionList from '@/components/wallet/TransactionList';
import { useWalletLookup } from '@/hooks/useWalletLookup';
import { useWalletTransactions } from '@/hooks/useWalletTransactions';
import TransactionSearchForm from '@/components/wallet/TransactionSearchForm';

export default function HomePage() {
    const router = useRouter();
  const [submittedWallet, setSubmittedWallet] = useState<string>('');

  const {
    summary,
    balances,
    isLoading: walletLookupLoading,
    error: walletLookupError,
    isValidAddress,
  } = useWalletLookup(submittedWallet);

  const {
    transactions,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useWalletTransactions(submittedWallet, 20);

  const walletStatus = useMemo(() => {
    if (!submittedWallet) return 'Awaiting wallet address';
    if (!isValidAddress) return 'Invalid wallet address';
    if (walletLookupLoading) return 'Fetching from ToroSDK...';
    if (walletLookupError) return 'Could not fetch wallet status';
    return summary?.status ?? 'Active on Toronet';
  }, [
    submittedWallet,
    isValidAddress,
    walletLookupLoading,
    walletLookupError,
    summary?.status,
  ]);

  function handleWalletSubmit(walletAddress: string) {
    setSubmittedWallet(walletAddress);
  }

  function handleTransactionSubmit(hash: string) {
    router.push(`/tx/${hash}`);
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <PageHeader
          title="ToroLens"
          description="Inspect wallets with a cleaner workflow: search once, review balances instantly, and monitor the latest Toronet activity in one place."
        />

        <SectionCard
          title="Wallet Inspector"
          description="Paste a wallet address to load account health, balances, and recent transactions."
        >
          <WalletSearchForm
            onSubmit={handleWalletSubmit}
            isLoading={walletLookupLoading || transactionsLoading}
          />
        </SectionCard>

 <SectionCard
            title="Transaction Inspector"
            description="Jump directly to a transaction details page using a transaction hash."
          >
            <TransactionSearchForm onSubmit={handleTransactionSubmit} />
          </SectionCard>

        {submittedWallet && !isValidAddress ? (
          <ErrorState message="Enter a valid 0x-prefixed 40-byte wallet address." />
        ) : null}

        {walletLookupError ? <ErrorState message={walletLookupError} /> : null}
        {transactionsError ? <ErrorState message={transactionsError} /> : null}

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Network
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              Toronet
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Explorer Mode
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              Wallet Intelligence
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Selected Wallet
            </p>
            <p className="mt-2 truncate text-lg font-semibold text-slate-900">
              {submittedWallet || 'Not selected'}
            </p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
         <WalletSummaryCard
  walletAddress={summary?.address ?? submittedWallet}
  walletStatus={walletStatus}
  walletLabel={summary?.label}
  isKycVerified={summary?.isKycVerified}
  isLoading={walletLookupLoading}
/>

          <BalanceCards
            balances={balances}
            isLoading={walletLookupLoading}
          />
        </div>

        <TransactionList
          transactions={transactions}
          isLoading={transactionsLoading}
        />
      </div>
    </main>
  );
}