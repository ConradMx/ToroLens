import Link from 'next/link';
import SectionCard from '@/components/ui/SectionCard';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import { shortenHash } from '@/libs/toronet/formatters';
import type { TransactionItem } from '@/types/transaction';

type TransactionListProps = {
  transactions?: TransactionItem[];
  isLoading?: boolean;
};

const demoTransactions: TransactionItem[] = [
  {
    hash: '0x71be8b3f4c9d1e2a88f0',
    type: 'Transfer',
    status: 'success',
    date: 'Apr 2, 2026',
  },
  {
    hash: '0x9fc2a18d56e4b31c0021',
    type: 'Deposit',
    status: 'pending',
    date: 'Apr 1, 2026',
  },
  {
    hash: '0xa20fb6e17d2cc519be44',
    type: 'Claim',
    status: 'failed',
    date: 'Mar 31, 2026',
  },
];

export default function TransactionList({
  transactions,
  isLoading = false,
}: TransactionListProps) {
  const rows = transactions ?? demoTransactions;

  return (
    <SectionCard
      title="Recent Transactions"
      description="Your transaction list, status badges, and detail actions will live here."
    >
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-xl bg-slate-200"
            />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          title="No transactions loaded"
          description="Transaction activity will appear here once wallet lookup is connected."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="hidden grid-cols-5 bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 md:grid">
            <span>Hash</span>
            <span>Type</span>
            <span>Status</span>
            <span>Date</span>
            <span>Action</span>
          </div>

          <div className="divide-y divide-slate-200">
            {rows.map((transaction) => (
              <div
                key={transaction.hash}
                className="grid gap-3 px-4 py-4 md:grid-cols-5 md:items-center"
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 md:hidden">
                    Hash
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {shortenHash(transaction.hash)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 md:hidden">
                    Type
                  </p>
                  <p className="text-sm text-slate-600">{transaction.type}</p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 md:hidden">
                    Status
                  </p>
                  <StatusBadge status={transaction.status} />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 md:hidden">
                    Date
                  </p>
                  <p className="text-sm text-slate-600">{transaction.date}</p>
                </div>

                <div>
                  <Link
                    href={`/tx/${transaction.hash}`}
                    className="inline-flex text-sm font-medium text-slate-900 underline-offset-4 hover:underline"
                  >
                    View details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionCard>
  );
}