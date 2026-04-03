type TransactionDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function TransactionDetailsModal({
  isOpen,
  onClose,
}: TransactionDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Transaction Details
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Modal wiring will be added in a later step.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">
            Selected transaction details will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}