const appointments = [
  { client: 'Sam Lee', time: '09:00 AM', service: 'Classic Cut', status: 'Confirmed' },
  { client: 'Nina Patel', time: '10:30 AM', service: 'Beard Trim', status: 'Pending' },
  { client: 'Daniel Wu', time: '01:00 PM', service: 'Full Service', status: 'Confirmed' },
];

export default function AppointmentsPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">Schedule</p>
            <h1 className="mt-2 text-4xl font-black text-slate-900">Appointments</h1>
          </div>
          <button className="rounded-xl bg-violet-600 px-4 py-2.5 font-semibold text-white">
            + New booking
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-slate-700">Client</th>
                <th className="px-6 py-3 text-sm font-semibold text-slate-700">Time</th>
                <th className="px-6 py-3 text-sm font-semibold text-slate-700">Service</th>
                <th className="px-6 py-3 text-sm font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {appointments.map((appointment) => (
                <tr key={appointment.client}>
                  <td className="px-6 py-4 font-medium text-slate-900">{appointment.client}</td>
                  <td className="px-6 py-4 text-slate-600">{appointment.time}</td>
                  <td className="px-6 py-4 text-slate-600">{appointment.service}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700">
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
