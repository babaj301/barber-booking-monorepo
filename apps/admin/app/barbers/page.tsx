const barbers = [
  { name: 'Alex Carter', specialty: 'Classic cuts', status: 'Available' },
  { name: 'Marcus Hill', specialty: 'Beards', status: 'Busy' },
  { name: 'Jasmine Cole', specialty: 'Styling', status: 'Available' },
];

export default function BarbersPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
              Team
            </p>
            <h1 className="mt-2 text-4xl font-black text-slate-900">Barbers</h1>
          </div>
          <button className="rounded-xl bg-violet-600 px-4 py-2.5 font-semibold text-white">
            + Add barber
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {barbers.map((barber) => (
            <div
              key={barber.name}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 h-14 w-14 rounded-full bg-violet-100" />
              <h2 className="text-xl font-bold text-slate-900">
                {barber.name}
              </h2>
              <p className="mt-2 text-sm text-slate-500">{barber.specialty}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {barber.status}
                </span>
                <button className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
