const services = [
  { name: 'Classic Cut', price: '$35', duration: '45 min' },
  { name: 'Beard Trim', price: '$20', duration: '20 min' },
  { name: 'Full Service', price: '$70', duration: '75 min' },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
              Catalog
            </p>
            <h1 className="mt-2 text-4xl font-black text-slate-900">
              Services
            </h1>
          </div>
          <button className="rounded-xl bg-violet-600 px-4 py-2.5 font-semibold text-white">
            + Add service
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.name}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 h-12 w-12 rounded-xl bg-violet-100" />
              <h2 className="text-xl font-bold text-slate-900">
                {service.name}
              </h2>
              <p className="mt-2 text-sm text-slate-500">{service.duration}</p>
              <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
                <span className="text-2xl font-black text-slate-900">
                  {service.price}
                </span>
                <button className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
