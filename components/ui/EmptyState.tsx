type EmptyStateProps = {
  title: string;
  description: string;
};

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white px-4 py-10 text-center">
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}