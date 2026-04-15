'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import SectionCard from '@/components/ui/SectionCard';
import StatusBadge from '@/components/ui/StatusBadge';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';
import { shortenAddress } from '@/libs/toronet/formatters';
import { useTransactionDetails } from '@/hooks/useTransactionDetails';

export default function TransactionDetailsPage() {
  const params = useParams<{ hash: string }>();
  const hash = typeof params?.hash === 'string' ? params.hash : '';

  const { transaction, isLoading, error, isValidHash } =
    useTransactionDetails(hash);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="text-sm font-medium text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline"
            >
              ← Back to ToroLens
            </Link>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Transaction Details
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Review transaction routing, execution outcome, and failure insight.
            </p>
          </div>

          {transaction ? <StatusBadge status={transaction.status} /> : null}
        </div>

        {!isValidHash ? (
          <ErrorState message="Enter a valid 0x-prefixed 64-character transaction hash in the URL." />
        ) : null}

        {error ? <ErrorState message={error} /> : null}

        {isLoading ? (
          <SectionCard title="Loading" description="Fetching live transaction data.">
            <LoadingState lines={6} />
          </SectionCard>
        ) : null}

        {transaction ? (
          <>
            <SectionCard
              title="Overview"
              description="High-level transaction metadata."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700">Hash</p>
                  <p className="mt-2 break-all text-sm text-slate-600">
                    {transaction.hash}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700">Type</p>
                  <p className="mt-2 text-sm text-slate-600">{transaction.type}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700">Date</p>
                  <p className="mt-2 text-sm text-slate-600">{transaction.date}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700">Network</p>
                  <p className="mt-2 text-sm text-slate-600">{transaction.network}</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Value & Routing"
              description="Core transaction movement details."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700">From</p>
                  <p className="mt-2 break-all text-sm text-slate-600">
                    {transaction.from}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Short form: {shortenAddress(transaction.from)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700">To</p>
                  <p className="mt-2 break-all text-sm text-slate-600">
                    {transaction.to}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Short form: {shortenAddress(transaction.to)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700">Amount</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {transaction.amount} {transaction.asset}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700">Fee</p>
                  <p className="mt-2 text-sm text-slate-600">{transaction.fee}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                  <p className="text-sm font-medium text-slate-700">Block Number</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {transaction.blockNumber}
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Execution Insight"
              description="Human-readable explanation of the transaction outcome."
            >
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700">Explanation</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {transaction.humanExplanation}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-700">Raw Error</p>
                    <p className="mt-2 text-sm text-slate-600">
                      {transaction.rawError || 'No raw error reported.'}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-700">Revert Reason</p>
                    <p className="mt-2 text-sm text-slate-600">
                      {transaction.revertReason || 'No revert reason reported.'}
                    </p>
                  </div>
                </div>
              </div>
            </SectionCard>
          </>
        ) : null}
      </div>
    </main>
  );
}