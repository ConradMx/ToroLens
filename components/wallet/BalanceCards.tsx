import SectionCard from '@/components/ui/SectionCard';
import EmptyState from '@/components/ui/EmptyState';

type BalanceItem = {
  symbol: string;
  value: string;
};

type BalanceCardsProps = {
  balances?: BalanceItem[];
  isLoading?: boolean;
};

const defaultBalances: BalanceItem[] = [
  { symbol: 'TNGN', value: '--' },
  { symbol: 'TUSD', value: '--' },
  { symbol: 'ToroG', value: '--' },
];

export default function BalanceCards({
  balances,
  isLoading = false,
}: BalanceCardsProps) {
  const displayBalances =
    balances && balances.length > 0 ? balances : defaultBalances;

  return (
    <SectionCard
       title="Portfolio Snapshot"
     description="Token balances for the selected wallet."
      className="lg:col-span-2"
    >
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-xl bg-slate-200"
            />
          ))}
        </div>
      ) : balances && balances.length === 0 ? (
        <EmptyState
          title="No balances found"
          description="This wallet has no available balance data yet."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {displayBalances.map((balance) => (
            <div
              key={balance.symbol}
              className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4"
            >
               <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {balance.symbol}
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">
                {balance.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}