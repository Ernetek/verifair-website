import type { Metadata } from "next";

import { FinalCTA } from "@/components/home/CTA";
import { FAQSection } from "@/components/home/FAQ";
import { HeroSection } from "@/components/home/Hero";
import { IndustriesSection } from "@/components/home/Industries";
import { PilotDeploymentSection } from "@/components/home/PilotDeployment";
import { HomepageInteractiveDemo } from "@/components/home/HomepageInteractiveDemo";
import { ProblemSection } from "@/components/home/Problem";
import { OperationalArchitectureSection } from "@/components/home/OperationalArchitecture";

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
      <OperationalArchitectureSection />
      <HomepageInteractiveDemo />
      <PilotDeploymentSection />
      <IndustriesSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
