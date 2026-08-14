import Image from "next/image";
import Link from "next/link";
import {
  ArrowPathIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  CloudIcon,
  CpuChipIcon,
  DocumentChartBarIcon,
  ShieldCheckIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";

const systemPath = [
  { label: "Dustlight Sensing", Icon: SignalIcon },
  { label: "VerifAir Edge", Icon: CpuChipIcon },
  { label: "Independent Communications", Icon: ArrowPathIcon },
  { label: "Centralised Monitoring", Icon: ChartBarIcon },
  { label: "Operational Workflow", Icon: ClipboardDocumentCheckIcon },
  { label: "Evidence & Reporting", Icon: DocumentChartBarIcon },
] as const;

const principles = [
  ["PRACTICAL", "Technology designed around real project and operational requirements.", CpuChipIcon],
  ["RESILIENT", "Independent communications, system-health monitoring and recovery-oriented Edge architecture.", ShieldCheckIcon],
  ["MANAGEABLE", "Remote diagnostics, software lifecycle and security maintenance are designed into the platform.", ArrowPathIcon],
  ["SCALABLE", "Architecture designed to support multiple monitoring zones, sites and future VerifAir solution offerings.", CloudIcon],
] as const;

export function AboutPage() {
  return (
    <div className="bg-white text-slate-950">
      <section className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-700">ABOUT VERIFAIR</p>
            <h1 className="mt-5 text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl">Engineering better operational visibility.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">VerifAir was created by ERNE Tech to connect distributed particulate sensing with the visibility, resilient infrastructure, operational response and reporting needed for real-world projects.</p>
            <p className="mt-5 font-bold text-slate-900">Powered by Dustlight sensing technology. Engineered by ERNE Tech.</p>
          </div>
          <div className="border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">Brand hierarchy</p>
            <div className="mt-5 grid gap-5">
              <div><h2 className="text-2xl font-black">VERIFAIR</h2><p className="mt-1 text-slate-600">The product and customer-facing platform.</p></div>
              <div className="border-t border-slate-200 pt-5"><h2 className="text-2xl font-black">ERNE TECH</h2><p className="mt-1 text-slate-600">The technical solutions and systems engineering company that created and engineers VerifAir.</p></div>
              <div className="border-t border-slate-200 pt-5"><h2 className="text-2xl font-black">DUSTLIGHT</h2><p className="mt-1 text-slate-600">The particulate sensing technology used by VerifAir.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-16 sm:py-20">
        <div className="container grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div><p className="text-sm font-black uppercase tracking-[0.16em] text-blue-700">WHY VERIFAIR EXISTS</p><h2 className="mt-4 text-4xl font-black tracking-tight">Built around an operational gap.</h2></div>
          <div className="max-w-3xl text-lg leading-8 text-slate-600"><p>Particulate monitors can provide valuable readings. Complex projects need more than individual devices—they need a shared view across monitoring locations, reliable communications, coordinated response and a clear record of what happened next.</p><p className="mt-5">VerifAir was developed to connect those pieces into one operational system.</p></div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20">
        <div className="container">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-700">WHAT VERIFAIR BRINGS TOGETHER</p>
          <div className="mt-8 flex flex-col lg:flex-row lg:items-center">
            {systemPath.map(({ label, Icon }, index) => <div key={label} className="flex items-center lg:flex-1"><div className="flex min-w-0 flex-1 items-center gap-3 border border-slate-200 bg-white p-4"><Icon className="h-7 w-7 shrink-0 text-blue-700" aria-hidden="true" /><span className="text-sm font-black text-slate-900">{label}</span></div>{index < systemPath.length - 1 ? <span className="px-3 py-2 text-xl font-bold text-blue-500 lg:py-0">→</span> : null}</div>)}
          </div>
          <p className="mt-8 text-lg font-black tracking-[0.12em] text-blue-700">ASSESS → ACT → RECORD</p>
        </div>
      </section>

      <section className="border-b border-slate-200 py-16 sm:py-20">
        <div className="container grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div><p className="text-sm font-black uppercase tracking-[0.16em] text-blue-700">ENGINEERED BY ERNE TECH</p><h2 className="mt-4 text-4xl font-black tracking-tight">More than 20 years of IT and systems engineering experience.</h2></div>
          <div className="text-lg leading-8 text-slate-600"><p>VerifAir is engineered by ERNE Tech, a technical solutions provider built on more than 20 years of IT and systems engineering experience.</p><p className="mt-5">Its systems-engineering background underpins VerifAir&apos;s approach to Edge infrastructure, communications resilience, monitoring, automation, system health, security, remote management and operational reliability.</p><h3 className="mt-10 text-3xl font-black text-slate-950">Engineering with ownership.</h3><p className="mt-4">ERNE Tech operates within the broader ERNE family-business group, bringing a practical, hands-on approach to developing and supporting technical solutions for real operational environments.</p><Image src="/assets/erne_tech_gradient_logo.webp" alt="ERNE Tech" width={360} height={120} className="mt-8 h-auto w-44 object-contain object-left" /></div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20">
        <div className="container grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div><p className="text-sm font-black uppercase tracking-[0.16em] text-blue-700">VERIFAIR + DUSTLIGHT</p><h2 className="mt-4 text-4xl font-black tracking-tight">Purpose-built around proven particulate sensing.</h2></div>
          <div><p className="text-lg leading-8 text-slate-600">VerifAir uses Dustlight particulate monitors as its sensing layer and extends that capability with VerifAir Edge, independent communications, centralised multi-site and multi-zone visibility, operational workflow, system management and reporting.</p><div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center"><div className="border border-slate-200 bg-white p-5"><p className="text-xl font-black">DUSTLIGHT</p><p className="mt-2 text-sm text-slate-600">Particulate sensing</p></div><span className="text-3xl font-black text-blue-600">+</span><div className="border border-slate-200 bg-white p-5"><p className="text-xl font-black">VERIFAIR</p><p className="mt-2 text-sm text-slate-600">Operational visibility, infrastructure, workflow and records</p></div></div></div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-16 sm:py-20"><div className="container"><p className="text-sm font-black uppercase tracking-[0.16em] text-blue-700">ENGINEERING PRINCIPLES</p><div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{principles.map(([title, body, Icon]) => <article key={title} className="border border-slate-200 bg-white p-5"><Icon className="h-7 w-7 text-blue-700" aria-hidden="true" /><h2 className="mt-4 text-sm font-black tracking-[0.12em]">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{body}</p></article>)}</div></div></section>

      <section className="bg-slate-950 py-16 text-white sm:py-20"><div className="container flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-4xl font-black tracking-tight sm:text-5xl">Built for real projects. Engineered for what comes next.</h2></div><div className="flex flex-wrap gap-3"><Link href="/industries" className="inline-flex min-h-12 items-center justify-center bg-blue-500 px-6 font-black text-slate-950 hover:bg-blue-400">Explore VerifAir Solutions</Link><Link href="/contact" className="inline-flex min-h-12 items-center justify-center border border-white/40 px-6 font-black text-white hover:bg-white/10">Discuss Your Project</Link></div></div></section>
    </div>
  );
}
