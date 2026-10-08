import Link from 'next/link';

const stats = [
  { label: 'Appointments today', value: '18' },
  { label: 'Open slots', value: '12' },
  { label: 'Revenue', value: '$1,240' },
];

export default function AdminHomePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-violet-600">Barber OS</p>
            <h1 className="text-2xl font-bold text-slate-900">
              Admin dashboard
            </h1>
          </div>
          <nav className="flex gap-4 text-sm font-medium text-slate-700">
            <Link href="/appointments">Appointments</Link>
            <Link href="/barbers">Barbers</Link>
            <Link href="/services">Services</Link>
          </nav>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="text-sm text-slate-500">{stat.label}</div>
              <div className="mt-4 text-3xl font-black text-slate-900">
                {stat.value}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Upcoming appointments
            </h2>
            <div className="mt-6 space-y-4">
              {['09:00 AM', '10:30 AM', '01:00 PM'].map((slot, index) => (
                <div
                  key={slot}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
                >
                  <div>
                    <div className="font-semibold text-slate-900">
                      Client {index + 1}
                    </div>
                    <div className="text-sm text-slate-500">
                      Haircut + Beard trim
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-violet-700">
                    {slot}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Quick actions</h2>
            <div className="mt-6 space-y-3">
              <Link
                href="/appointments/new"
                className="block rounded-xl bg-violet-600 px-4 py-3 text-center font-semibold text-white"
              >
                New booking
              </Link>
              <Link
                href="/availability"
                className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center font-semibold text-slate-700"
              >
                Manage availability
              </Link>
              <Link
                href="/services"
                className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center font-semibold text-slate-700"
              >
                Review services
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
