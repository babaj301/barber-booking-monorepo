const services = [
  { name: 'Classic Cut', duration: '45 min', price: '$35' },
  { name: 'Beard Trim', duration: '20 min', price: '$20' },
  { name: 'Full Service', duration: '75 min', price: '$70' },
  { name: 'Kids Cut', duration: '30 min', price: '$25' },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
              Services
            </p>
            <h1 className="mt-2 text-4xl font-black text-slate-900">
              Choose your service
            </h1>
          </div>
          <a href="/book" className="rounded-xl bg-violet-600 px-4 py-2.5 font-semibold text-white">
            Book now
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <div key={service.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 h-12 w-12 rounded-xl bg-violet-100" />
              <h2 className="text-xl font-bold text-slate-900">{service.name}</h2>
              <p className="mt-2 text-sm text-slate-500">{service.duration}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-2xl font-black text-slate-900">{service.price}</span>
                <button className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
