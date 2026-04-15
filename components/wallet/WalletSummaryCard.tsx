import SectionCard from '@/components/ui/SectionCard';
import EmptyState from '@/components/ui/EmptyState';

type WalletSummaryCardProps = {
  walletAddress?: string;
  walletStatus?: string;
  isLoading?: boolean;
};

export default function WalletSummaryCard({
  walletAddress,
  walletStatus = 'Awaiting SDK integration',
  isLoading = false,
}: WalletSummaryCardProps) {
  return (
    <SectionCard
      title="Wallet Summary"
        description="Overview of the selected wallet and sync status."
      className="lg:col-span-1"
    >
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-24 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-24 animate-pulse rounded-xl bg-slate-200" />
        </div>
      ) : walletAddress ? (
        <div className="space-y-3">
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Selected Wallet
            </p>
            <p className="mt-2 break-all text-sm text-slate-500">
              {walletAddress}
            </p>
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Wallet Status
            </p>
           <p className="mt-2 text-sm text-slate-700">{walletStatus}</p>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No wallet selected"
          description="Enter a wallet address above to inspect wallet details."
        />
      )}
    </SectionCard>
  );
}