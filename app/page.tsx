import type { Metadata } from "next";

import { FinalCTA } from "@/components/home/CTA";
import { FAQSection } from "@/components/home/FAQ";
import { HeroSection } from "@/components/home/Hero";
import { IndustriesSection } from "@/components/home/Industries";
import { PilotDeploymentSection } from "@/components/home/PilotDeployment";
import { HomepageInteractiveDemo } from "@/components/home/HomepageInteractiveDemo";
import { ProblemSection } from "@/components/home/Problem";
import { ResponsibilityBoundaries } from "@/components/shared/ResponsibilityBoundaries";
import { VerifAirProcessSection } from "@/components/shared/VerifAirProcess";

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
      <VerifAirProcessSection />
      <HomepageInteractiveDemo />
      <ResponsibilityBoundaries />
      <PilotDeploymentSection />
      <IndustriesSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
