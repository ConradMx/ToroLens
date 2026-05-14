import SectionCard from '@/components/ui/SectionCard';
import EmptyState from '@/components/ui/EmptyState';

type WalletSummaryCardProps = {
  walletAddress?: string;
  walletStatus?: string;
  walletLabel?: string;
  isKycVerified?: boolean;
  isEnrolled?: boolean;
  role?: string;
  isLoading?: boolean;
};

export default function WalletSummaryCard({
  walletAddress,
  walletStatus = 'Awaiting SDK integration',
  walletLabel,
  isKycVerified = false,
  isEnrolled,
  role,
  isLoading = false,
}: WalletSummaryCardProps) {
  return (
    <SectionCard
      title="Wallet Summary"
      description="Selected wallet overview and account metadata."
      className="lg:col-span-1"
    >
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-24 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-24 animate-pulse rounded-xl bg-slate-200" />
        </div>
      ) : walletAddress ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">Selected Wallet</p>
            <p className="mt-2 break-all text-sm text-slate-500">
              {walletAddress}
            </p>
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">Wallet Status</p>
            <p className="mt-2 text-sm text-slate-500">{walletStatus}</p>
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">Label</p>
            <p className="mt-2 text-sm text-slate-500">
              {walletLabel || 'No label available'}
            </p>
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">Role</p>
            <p className="mt-2 text-sm text-slate-500">
              {role || 'Unavailable'}
            </p>
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">Enrollment</p>
            <p className="mt-2 text-sm text-slate-500">
              {isEnrolled === undefined
                ? 'Unavailable'
                : isEnrolled
                  ? 'Enrolled'
                  : 'Not enrolled'}
            </p>
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">KYC</p>
            <p className="mt-2 text-sm text-slate-500">
              {isKycVerified ? 'Verified' : 'Not verified / unavailable'}
            </p>
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
