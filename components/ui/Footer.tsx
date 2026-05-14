import { Code2, GitBranch, ServerCog } from 'lucide-react';

const flows = [
  {
    icon: ServerCog,
    title: 'Gateway boundary',
    body: 'Routes call query services, query services call the Toronet gateway, and the gateway is the only layer allowed to import torosdk.',
  },
  {
    icon: GitBranch,
    title: 'SDK-first adapters',
    body: 'Each Toronet capability is wrapped as a named SDK operation with timeout handling and normalized output contracts.',
  },
  {
    icon: Code2,
    title: 'Extension path',
    body: 'Add new ecosystem features by creating a gateway method, mapper, route, hook, then UI surface in that order.',
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#031317] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
              Developer Reference Flow
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">
              Forkable Toronet architecture, visible at the edge.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-300">
            ToroLens keeps integration decisions explicit so builders can trace
            each request from UI to route handler, gateway, SDK call, mapper,
            and normalized product surface.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {flows.map((flow) => {
            const Icon = flow.icon;

            return (
              <div
                key={flow.title}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
              >
                <Icon className="h-5 w-5 text-emerald-300" aria-hidden />
                <p className="mt-3 text-sm font-semibold text-white">
                  {flow.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {flow.body}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>ToroLens is a Toronet reference platform for ecosystem builders.</p>
          <p>SDK-first gateway. Normalized contracts. Production-minded routes.</p>
        </div>
      </div>
    </footer>
  );
}
