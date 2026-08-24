import { ArrowRightIcon } from "@heroicons/react/24/outline";

type StageId = "assess" | "act" | "report";

const stages: ReadonlyArray<{
  id: StageId;
  title: string;
  detail: string;
  tone: string;
  activeTone: string;
}> = [
  {
    id: "assess",
    title: "ASSESS",
    detail: "Monitoring establishes actionable context",
    tone: "border-emerald-300 bg-white/95 text-slate-900",
    activeTone: "border-emerald-600 bg-emerald-50 text-emerald-900",
  },
  {
    id: "act",
    title: "ACT",
    detail: "Workflow coordinates responsive action",
    tone: "border-amber-300 bg-white/95 text-slate-900",
    activeTone: "border-amber-600 bg-amber-50 text-amber-900",
  },
  {
    id: "report",
    title: "REPORT",
    detail: "Recorded actions lead to evidence reporting",
    tone: "border-red-300 bg-white/95 text-slate-900",
    activeTone: "border-red-600 bg-red-50 text-red-900",
  },
];

export function HeroOperationalFlow({ active }: { active: StageId }) {
  return (
    <div
      className="border border-slate-200/90 bg-white/85 p-2 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.6)] backdrop-blur-sm sm:p-3"
      aria-label="Assess, Act and Record flow"
    >
      <div className="grid grid-cols-3 items-stretch gap-1.5 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-2.5">
        {stages.map((stage, index) => {
          const isActive = stage.id === active;
          return (
            <div key={stage.id} className="contents">
              <div className={`flex min-h-[4.2rem] flex-col justify-center border px-2 py-1 text-center sm:min-h-[5.1rem] sm:px-3 sm:py-2 ${isActive ? `border-2 ${stage.activeTone}` : stage.tone}`}>
                <p className="text-[10px] font-black tracking-[0.08em] sm:text-sm">{stage.title}</p>
                <p className={`mt-1 text-[9px] font-bold leading-4 sm:text-xs ${isActive ? "" : "text-slate-600"}`}>{stage.detail}</p>
              </div>
              {index < stages.length - 1 ? (
                <div className="hidden items-center justify-center sm:flex">
                  <ArrowRightIcon className="size-4 text-blue-700" aria-hidden="true" />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
