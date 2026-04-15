type StatusBadgeProps = {
  status: 'success' | 'pending' | 'failed' | 'unknown';
};

const statusStyles: Record<StatusBadgeProps['status'], string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  failed: 'bg-rose-50 text-rose-700 border-rose-200',
  unknown: 'bg-slate-100 text-slate-700 border-slate-200',
};

const statusLabels: Record<StatusBadgeProps['status'], string> = {
  success: 'Success',
  pending: 'Pending',
  failed: 'Failed',
  unknown: 'Unknown',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}