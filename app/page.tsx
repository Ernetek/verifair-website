import type { Metadata } from "next";

import { FinalCTA } from "@/components/home/CTA";
import { CoordinatedSolutionSection } from "@/components/home/CoordinatedSolution";
import { FAQSection } from "@/components/home/FAQ";
import { HeroSection } from "@/components/home/Hero";
import { IndustriesSection } from "@/components/home/Industries";
import { PilotDeploymentSection } from "@/components/home/PilotDeployment";
import { PolicyReadinessBanner } from "@/components/home/PolicyReadinessBanner";
import { ProblemSection } from "@/components/home/Problem";
import { ReportingProof } from "@/components/home/ReportingProof";
import { PageDisclaimer } from "@/components/legal/PageDisclaimer";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PolicyReadinessBanner />
      <ProblemSection />
      <CoordinatedSolutionSection />
      <IndustriesSection />
      <ReportingProof />
      <PilotDeploymentSection />
      <FAQSection />
      <FinalCTA />
      <PageDisclaimer />
    </>
  );
}
