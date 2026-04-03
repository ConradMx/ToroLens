export default function Loading() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="h-28 rounded-2xl bg-slate-200" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-56 rounded-2xl bg-slate-200" />
            <div className="h-56 rounded-2xl bg-slate-200 lg:col-span-2" />
          </div>
          <div className="h-72 rounded-2xl bg-slate-200" />
        </div>
      </div>
    </main>
  );
}