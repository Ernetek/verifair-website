import type { Metadata } from "next";

import { FinalCTA } from "@/components/home/CTA";
import { FAQSection } from "@/components/home/FAQ";
import { HeroSection } from "@/components/home/Hero";
import { IndustriesSection } from "@/components/home/Industries";
import { PilotDeploymentSection } from "@/components/home/PilotDeployment";
import {
  ArchitectureStorySection,
  CapabilitySection,
} from "@/components/demonstration/DemonstrationOverview";
import { UnifiedDemonstration } from "@/components/demonstration/UnifiedDemonstration";
import { ProblemSection } from "@/components/home/Problem";
import { PageDisclaimer } from "@/components/legal/PageDisclaimer";

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
      <ArchitectureStorySection />
      <UnifiedDemonstration />
      <CapabilitySection />
      <PilotDeploymentSection />
      <IndustriesSection />
      <FAQSection />
      <FinalCTA />
      <PageDisclaimer />
    </>
  );
}
