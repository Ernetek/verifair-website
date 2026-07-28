import { BellAlertIcon, CheckCircleIcon, MapPinIcon, SignalIcon } from "@heroicons/react/24/outline";

const zones = [
  { name: "Hospital boundary", pm1: 8, pm25: 16, pm10: 42, status: "Normal" },
  { name: "Loading dock", pm1: 18, pm25: 39, pm10: 86, status: "Elevated" },
  { name: "Ward corridor", pm1: 7, pm25: 13, pm10: 28, status: "Normal" },
  { name: "Work front A", pm1: 28, pm25: 58, pm10: 121, status: "Alert" }
];

const statCards = [
  { label: "Sensors online", value: "23/24", icon: CheckCircleIcon, colour: "text-emerald-300" },
  { label: "Active alerts", value: "1", icon: BellAlertIcon, colour: "text-red-300" },
  { label: "Zones monitored", value: "8", icon: SignalIcon, colour: "text-sky-300" }
];

export function DashboardPreview() {
  return (
    <div className="card overflow-hidden bg-slate-950 text-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-sm font-bold text-slate-400">VerifAir dashboard</p>
          <h3 className="text-xl font-black">North Wing Redevelopment</h3>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-200">Demonstration data</span>
      </div>
      <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
          <div className="grid gap-3 sm:grid-cols-3">
            {statCards.map(({ label, value, icon: Icon, colour }) => (
              <div key={label} className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                <Icon className={`h-5 w-5 ${colour}`} />
                <p className="mt-4 text-2xl font-black">{value}</p>
                <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 overflow-hidden rounded-md border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase text-slate-400">
                <tr>
                  <th className="p-3">Zone</th>
                  <th className="p-3">PM1</th>
                  <th className="p-3">PM2.5</th>
                  <th className="p-3">PM10</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone) => (
                  <tr key={zone.name} className="border-t border-white/10">
                    <td className="p-3 font-bold">{zone.name}</td>
                    <td className="p-3 font-mono">{zone.pm1}</td>
                    <td className="p-3 font-mono">{zone.pm25}</td>
                    <td className="p-3 font-mono">{zone.pm10}</td>
                    <td className={`p-3 font-bold ${zone.status === "Alert" ? "text-red-300" : zone.status === "Elevated" ? "text-amber-300" : "text-emerald-300"}`}>
                      {zone.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-400">Readings shown in ug/m3 for demonstration only. Project thresholds must be configured to suit professional monitoring strategy.</p>
        </div>
        <div className="p-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-white/10 bg-[linear-gradient(135deg,#132033,#0b1220)]">
            {zones.map((zone, index) => (
              <div
                key={zone.name}
                className={`absolute flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold backdrop-blur ${index === 0 ? "left-[12%] top-[22%]" : index === 1 ? "right-[11%] top-[33%]" : index === 2 ? "left-[18%] bottom-[18%]" : "right-[18%] bottom-[22%]"}`}
              >
                <MapPinIcon className={zone.status === "Alert" ? "h-4 w-4 text-red-300" : zone.status === "Elevated" ? "h-4 w-4 text-amber-300" : "h-4 w-4 text-emerald-300"} />
                {zone.name}
              </div>
            ))}
            <div className="absolute left-1/2 top-1/2 h-px w-[78%] -translate-x-1/2 bg-white/15" />
            <div className="absolute left-1/2 top-1/2 h-[72%] w-px -translate-y-1/2 bg-white/15" />
          </div>
          <div className="mt-5">
            <h4 className="font-black">Recent activity</h4>
            <ul className="mt-3 grid gap-3 text-sm text-slate-300">
              <li>10:42 Alert raised at Work front A.</li>
              <li>10:37 Loading dock moved to elevated watch.</li>
              <li>10:31 Gateway synchronised buffered records.</li>
              <li>10:18 Hospital boundary returned to normal.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
