export function ResponsibilityBoundaries() {
  return (
    <section className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24" aria-label="System and human responsibility">
      <div className="container grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">System responsibility</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            What VerifAir automates.
          </h2>
          <ul className="mt-6 grid gap-3 text-base leading-7 text-slate-700">
            <li className="border-l-4 border-blue-500 pl-4">Transfers and presents configured monitoring data.</li>
            <li className="border-l-4 border-blue-500 pl-4">Evaluates approved project operational triggers.</li>
            <li className="border-l-4 border-blue-500 pl-4">Surfaces alerts and maintains system event chronology.</li>
            <li className="border-l-4 border-blue-500 pl-4">Connects monitoring observations with response records.</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Human responsibility</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            What accountable people decide.
          </h2>
          <ul className="mt-6 grid gap-3 text-base leading-7 text-slate-700">
            <li className="border-l-4 border-emerald-500 pl-4">Approve locations, triggers, responsibilities and escalation paths.</li>
            <li className="border-l-4 border-emerald-500 pl-4">Assess site context and determine the appropriate response.</li>
            <li className="border-l-4 border-emerald-500 pl-4">Record actions, evidence, verification and closure decisions.</li>
            <li className="border-l-4 border-emerald-500 pl-4">Apply professional, regulatory and workplace requirements.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
