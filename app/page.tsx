'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import SectionCard from '@/components/ui/SectionCard';
import WalletSearchForm from '@/components/wallet/WalletSearchForm';
import WalletSummaryCard from '@/components/wallet/WalletSummaryCard';
import BalanceCards from '@/components/wallet/BalanceCards';
import TransactionList from '@/components/wallet/TransactionList';

export default function HomePage() {
  const [submittedWallet, setSubmittedWallet] = useState<string>('');

  function handleWalletSubmit(walletAddress: string) {
    setSubmittedWallet(walletAddress);
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
          <WalletSearchForm onSubmit={handleWalletSubmit} />
        </SectionCard>

    <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Network
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Toronet</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Explorer Mode
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Wallet Intelligence</p>
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
          <WalletSummaryCard walletAddress={submittedWallet} />
          <BalanceCards />
        </div>

        <TransactionList />
      </div>
    </main>
  );
}