import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
          404
        </p>
        <h1 className="mt-3 text-4xl font-black text-slate-900">
          Page not found
        </h1>
        <p className="mt-3 text-slate-600">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
