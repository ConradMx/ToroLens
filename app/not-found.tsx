import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-500">404</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          The page you are looking for does not exist or may have been moved.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Back to ToroLens
        </Link>
      </div>
    </main>
  );
}