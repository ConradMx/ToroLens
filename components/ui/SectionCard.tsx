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
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      {(title || description) && (
        <div className="mb-5 space-y-1">
          {title ? (
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          ) : null}
          {description ? (
            <p className="text-sm text-slate-600">{description}</p>
          ) : null}
        </div>
      )}

      {children}
    </section>
  );
}