"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function HeroMotion({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function FloatingTelemetry() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.35], [0, -70]);

  return (
    <motion.div
      style={{ y }}
      className="absolute bottom-6 right-4 hidden w-[25rem] max-w-[34vw] rounded-lg border border-white/35 bg-white/88 p-4 shadow-2xl backdrop-blur md:block"
      aria-hidden="true"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase text-slate-500">Live project overview</span>
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">Demo data</span>
      </div>
      {[
        ["Ward boundary", "PM2.5", "18", "Normal"],
        ["Loading dock", "PM10", "64", "Elevated"],
        ["Level 4 corridor", "PM1", "9", "Normal"]
      ].map(([zone, metric, value, status]) => (
        <div key={zone} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-t border-slate-200 py-3 text-sm">
          <span className="font-semibold text-slate-900">{zone}</span>
          <span className="font-mono text-slate-600">{metric}</span>
          <span className={status === "Elevated" ? "font-bold text-amber-700" : "font-bold text-emerald-700"}>{value} ug/m3</span>
        </div>
      ))}
    </motion.div>
  );
}
