import { PARTICULATE_QUALIFICATION } from "@/lib/metrics";

export function PageDisclaimer() {
  return (
    <aside className="border-t border-slate-300 bg-white" aria-label="Monitoring limitations">
      <div className="container py-5 text-[13px] leading-5 text-slate-700">
        {PARTICULATE_QUALIFICATION} VerifAir supports operational monitoring,
        response and record keeping, but does not replace competent risk
        assessment, occupational-hygiene advice, exposure assessment, specialist
        sampling, controls or project-specific legal obligations.
      </div>
    </aside>
  );
}
