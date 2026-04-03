type ErrorStateProps = {
  title?: string;
  message: string;
};

export default function ErrorState({
  title = 'Something went wrong',
  message,
}: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4">
      <h3 className="text-sm font-semibold text-red-700">{title}</h3>
      <p className="mt-1 text-sm text-red-600">{message}</p>
    </div>
  );
}