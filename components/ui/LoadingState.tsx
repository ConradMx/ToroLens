type LoadingStateProps = {
  lines?: number;
};

export default function LoadingState({
  lines = 3,
}: LoadingStateProps) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 rounded bg-slate-200"
        />
      ))}
    </div>
  );
}