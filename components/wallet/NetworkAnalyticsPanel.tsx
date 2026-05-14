import SectionCard from '@/components/ui/SectionCard';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import type { NetworkSnapshot } from '@/types/transaction';

type NetworkAnalyticsPanelProps = {
  snapshot: NetworkSnapshot | null;
  isLoading?: boolean;
  error?: string | null;
};

export default function NetworkAnalyticsPanel({
  snapshot,
  isLoading = false,
  error,
}: NetworkAnalyticsPanelProps) {
  return (
    <SectionCard
      title="Ecosystem Analytics"
      description="Network context loaded through the same SDK-first gateway used by wallet and transaction flows."
    >
      {error ? <ErrorState message={error} /> : null}
      {isLoading ? <LoadingState lines={4} /> : null}
      {snapshot ? (
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {snapshot.status}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Latest Block
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {snapshot.latestBlock}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Block Time
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {snapshot.latestBlockTime}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Recent Tx
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {snapshot.recentTransactionCount}
            </p>
          </div>
        </div>
      ) : null}
    </SectionCard>
  );
}
