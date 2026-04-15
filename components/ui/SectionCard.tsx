import { ReactNode } from 'react';

type SectionCardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export default function SectionCard({
  title,
  description,
  children,
  className = '',
}: SectionCardProps) {
  return (
    <section
      className={`rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_20px_60px_-38px_rgba(15,23,42,0.35)] backdrop-blur sm:p-6 ${className}`}
    >
      {(title || description) && (
        <div className="mb-5 space-y-1.5">
          {title ? (
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          ) : null}
          {description ? (
            <p className="text-sm leading-6 text-slate-600">{description}</p>
          ) : null}
        </div>
      )}

      {children}
    </section>
  );
}