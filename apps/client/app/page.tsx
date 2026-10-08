import Link from 'next/link';

const features = [
  'Fast barber discovery',
  'Online appointment booking',
  'Service pricing and availability',
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-violet-50">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight text-slate-900">
            Barber Booking
          </div>
          <nav className="flex gap-4 text-sm font-medium text-slate-700">
            <Link href="/services">Services</Link>
            <Link href="/book">Book</Link>
            <Link href="/login">Login</Link>
          </nav>
        </header>

        <section className="mt-16 grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
              Premium barber scheduling
            </p>
            <h1 className="text-5xl font-black tracking-tight text-slate-900">
              Book your next cut in minutes.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-600">
              Discover available barbers, choose your preferred services, and
              secure your perfect appointment time online.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/book"
                className="rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
              >
                Book now
              </Link>
              <Link
                href="/services"
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                View services
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
            <div className="rounded-2xl bg-slate-900 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Today
              </p>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl bg-slate-800 p-4">
                  <div className="text-sm text-slate-400">Opening slot</div>
                  <div className="mt-2 text-2xl font-bold">10:00 AM</div>
                </div>
                <div className="rounded-xl bg-slate-800 p-4">
                  <div className="text-sm text-slate-400">
                    Available stylist
                  </div>
                  <div className="mt-2 text-2xl font-bold">Alex Carter</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 h-10 w-10 rounded-xl bg-violet-100" />
              <h2 className="text-lg font-semibold text-slate-900">
                {feature}
              </h2>
              <p className="mt-2 text-slate-600">
                Built for a smooth barber experience from discovery to checkout.
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
