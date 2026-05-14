import SectionCard from '@/components/ui/SectionCard';
import type { WalletInsight, WalletPermission } from '@/types/wallet';

type WalletIntelligencePanelsProps = {
  permissions: WalletPermission[];
  insights: WalletInsight[];
  isLoading?: boolean;
};

export default function WalletIntelligencePanels({
  permissions,
  insights,
  isLoading = false,
}: WalletIntelligencePanelsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SectionCard
        title="Role & Permission Inspection"
        description="Toronet-native account capability state for the selected wallet."
      >
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-20 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-20 animate-pulse rounded-lg bg-slate-200" />
          </div>
        ) : (
          <div className="space-y-3">
            {permissions.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-slate-700">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {item.value}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Behavioral Summary"
        description="Small normalized signals that can grow into analytics widgets."
      >
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="h-28 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-28 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-28 animate-pulse rounded-lg bg-slate-200" />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {insights.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {item.value}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
