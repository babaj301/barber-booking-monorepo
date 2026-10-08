const timeSlots = ['09:00 AM', '10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'];

export default function BookPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">Booking</p>
          <h1 className="mt-2 text-4xl font-black text-slate-900">Reserve your slot</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-700">Select barber</label>
              <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <option>Alex Carter</option>
                <option>Marcus Hill</option>
                <option>Jasmine Cole</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Available times</label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Booking summary</h2>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Barber</span>
                <span className="font-medium text-slate-900">Alex Carter</span>
              </div>
              <div className="flex justify-between">
                <span>Service</span>
                <span className="font-medium text-slate-900">Classic Cut</span>
              </div>
              <div className="flex justify-between">
                <span>Time</span>
                <span className="font-medium text-slate-900">10:00 AM</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-4 text-base">
                <span>Total</span>
                <span className="font-black text-slate-900">$35</span>
              </div>
            </div>
            <button className="mt-8 w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white">
              Confirm booking
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
