import type { Metadata } from "next";

import { FinalCTA } from "@/components/home/CTA";
import { CoordinatedSolutionSection } from "@/components/home/CoordinatedSolution";
import { FAQSection } from "@/components/home/FAQ";
import { HeroSection } from "@/components/home/Hero";
import { IndustriesSection } from "@/components/home/Industries";
import { MonitoringRoomSection } from "@/components/home/MonitoringRoomSection";
import { ProblemSection } from "@/components/home/Problem";
import { ReportingProof } from "@/components/home/ReportingProof";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <MonitoringRoomSection />
      <CoordinatedSolutionSection />
      <ReportingProof />
      <IndustriesSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
