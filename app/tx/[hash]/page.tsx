import type { Metadata } from 'next';
import Link from 'next/link';
import SectionCard from '@/components/ui/SectionCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { explainTransactionFailure } from '@/libs/toronet/errors';
import { shortenAddress, shortenHash } from '@/libs/toronet/formatters';
import type { TransactionDetails } from '@/types/transaction';

type TransactionPageProps = {
  params: Promise<{ hash: string }>;
};

function getDemoTransactionDetails(hash: string): TransactionDetails {
  const normalizedHash = decodeURIComponent(hash);

  const failedHash = '0xa20fb6e17d2cc519be44';
  const pendingHash = '0x9fc2a18d56e4b31c0021';

  if (normalizedHash === failedHash) {
    const details: TransactionDetails = {
      hash: normalizedHash,
      type: 'Claim',
      status: 'failed',
      date: 'Mar 31, 2026',
      from: '0x12ab34cd56ef78ab90cd12ef34ab56cd78ef90ab',
      to: '0x12ab34cd56ef78ab90cd12ef34ab56cd78ef90ab',
      amount: '2,500',
      asset: 'TNGN',
      fee: '0.15',
      blockNumber: '1938221',
      network: 'Toronet Testnet',
      rawError: 'Transaction rejected by execution layer.',
      revertReason: 'Self transfer not allowed.',
      humanExplanation: '',
    };

    details.humanExplanation = explainTransactionFailure({
      status: details.status,
      from: details.from,
      to: details.to,
      rawError: details.rawError,
      revertReason: details.revertReason,
    });

    return details;
  }

  if (normalizedHash === pendingHash) {
    const details: TransactionDetails = {
      hash: normalizedHash,
      type: 'Deposit',
      status: 'pending',
      date: 'Apr 1, 2026',
      from: '0x98ef12ab45cd67ef89ab12cd34ef56ab78cd90ef',
      to: '0x21cd43ef65ab87cd09ef21ab43cd65ef87ab09cd',
      amount: '1,000',
      asset: 'TUSD',
      fee: '0.05',
      blockNumber: '--',
      network: 'Toronet Testnet',
      rawError: '',
      revertReason: '',
      humanExplanation:
        'This transaction is still pending confirmation or final processing.',
    };

    return details;
  }

  const details: TransactionDetails = {
    hash: normalizedHash,
    type: 'Transfer',
    status: 'success',
    date: 'Apr 2, 2026',
    from: '0x41cd22ef77ab11cd22ef77ab11cd22ef77ab11cd',
    to: '0x74ab55cd88ef44ab55cd88ef44ab55cd88ef44ab',
    amount: '4,250',
    asset: 'ToroG',
    fee: '0.08',
    blockNumber: '1938450',
    network: 'Toronet Testnet',
    rawError: '',
    revertReason: '',
    humanExplanation:
      'This transaction completed successfully and does not currently show any execution issues.',
  };

  return details;
}

export async function generateMetadata({
  params,
}: TransactionPageProps): Promise<Metadata> {
  const { hash } = await params;

  return {
    title: `Transaction ${shortenHash(hash)} | ToroLens`,
    description: `Inspect transaction ${hash} in ToroLens.`,
  };
}

export default async function TransactionDetailsPage({
  params,
}: TransactionPageProps) {
  const { hash } = await params;
  const transaction = getDemoTransactionDetails(hash);

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
              Review transaction state, addresses, execution outcome, and failure insight.
            </p>
          </div>

          <StatusBadge status={transaction.status} />
        </div>

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
          description="Human-readable transaction interpretation."
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">
                Explanation
              </p>
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
                <p className="text-sm font-medium text-slate-700">
                  Revert Reason
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {transaction.revertReason || 'No revert reason reported.'}
                </p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}