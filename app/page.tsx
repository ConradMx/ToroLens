'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import SectionCard from '@/components/ui/SectionCard';
import WalletSearchForm from '@/components/wallet/WalletSearchForm';
import WalletSummaryCard from '@/components/wallet/WalletSummaryCard';
import BalanceCards from '@/components/wallet/BalanceCrads';
import TransactionList from '@/components/wallet/TransactionList';

export default function HomePage() {
  const [submittedWallet, setSubmittedWallet] = useState<string>('');

  function handleWalletSubmit(walletAddress: string) {
    setSubmittedWallet(walletAddress);
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <PageHeader
          title="ToroLens"
          description="Inspect wallet activity, analyze transactions, and understand failures on Toronet."
        />

        <SectionCard
          title="Wallet Inspector"
          description="Start by entering a wallet address. In the next step, this form will connect to ToroSDK and load real wallet data."
        >
          <WalletSearchForm onSubmit={handleWalletSubmit} />
        </SectionCard>

        <div className="grid gap-6 lg:grid-cols-3">
          <WalletSummaryCard walletAddress={submittedWallet} />
          <BalanceCards />
        </div>

        <TransactionList />
      </div>
    </main>
  );
}