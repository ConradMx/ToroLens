type PageHeaderProps = {
  title: string;
  description: string;
};

export default function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
        Toronet Transaction Intelligence
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}