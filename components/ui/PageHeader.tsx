import {
  Activity,
  BadgeCheck,
  Blocks,
  BookOpen,
  Fingerprint,
  Network,
  Search,
  ShieldCheck,
} from 'lucide-react';

type PageHeaderProps = {
  title: string;
  description: string;
};

const capabilities = [
  {
    icon: Search,
    label: 'Wallet intelligence',
  },
  {
    icon: Activity,
    label: 'Transaction inspection',
  },
  {
    icon: Fingerprint,
    label: 'Identity resolution',
  },
  {
    icon: Blocks,
    label: 'Ecosystem analytics',
  },
];

const architectureSignals = [
  'Route handlers',
  'Gateway service',
  'ToroSDK',
  'Normalized contracts',
];

export default function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
    <header className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)]">
      <div className="border-b border-slate-200 bg-[#031317] px-5 py-4 text-white sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-300/30 bg-white/10 font-semibold text-emerald-200">
              TL
            </div>
            <div>
              <p className="text-lg font-semibold leading-none tracking-tight">
                {title}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                Toronet Reference Platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-emerald-100">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
              SDK-first
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-sky-300/30 bg-sky-300/10 px-3 py-2 text-sky-100">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Server-boundary
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-amber-100">
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              Fork-ready
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="px-5 py-6 sm:px-6 lg:py-7">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Production-grade Toronet application architecture
          </p>
          <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl">
            Wallet, transaction, identity, and ecosystem intelligence in one
            reference build.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            {description}
          </p>

          <div className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {capabilities.map((capability) => {
              const Icon = capability.icon;

              return (
                <div
                  key={capability.label}
                  className="flex min-h-14 items-center gap-3 rounded-lg border border-amber-300/30 bg-amber-300  px-3 py-2"
                >
                  <Icon className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
                  <span className="text-sm font-medium text-slate-800">
                    {capability.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* <aside className="border-t border-slate-200 bg-slate-50 px-5 py-6 sm:px-6 lg:border-l lg:border-t-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Network className="h-4 w-4 text-sky-700" aria-hidden />
            Request lifecycle
          </div>

          <div className="mt-4 space-y-2">
            {architectureSignals.map((signal, index) => (
              <div
                key={signal}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#031317] text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {signal}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm leading-6 text-emerald-950">
            Built to show how serious Toronet products should isolate upstream
            volatility, normalize data, and keep integration logic server-side.
          </div>
        </aside> */}
      </div>
    </header>
  );
}
