import { Code2, GitBranch, ServerCog } from 'lucide-react';
import SectionCard from '@/components/ui/SectionCard';

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

export default function ReferencePanel() {
  return (
    <SectionCard
      title="Developer Reference Flow"
      description="The app is intentionally structured as a forkable Toronet integration example."
    >
      <div className="grid gap-3 lg:grid-cols-3">
        {flows.map((flow) => {
          const Icon = flow.icon;

          return (
            <div
              key={flow.title}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <Icon className="h-5 w-5 text-emerald-700" aria-hidden />
              <p className="mt-3 text-sm font-semibold text-slate-900">
                {flow.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {flow.body}
              </p>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
