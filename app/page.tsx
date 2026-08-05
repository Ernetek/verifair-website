import { FinalCTA } from "@/components/home/CTA";
import { FAQSection } from "@/components/home/FAQ";
import { HeroSection } from "@/components/home/Hero";
import { IndustriesSection } from "@/components/home/Industries";
import { PlatformSection } from "@/components/home/Platform";
import { PolicyReadinessBanner } from "@/components/home/PolicyReadinessBanner";
import { ProblemSection } from "@/components/home/Problem";
import { ProofSection } from "@/components/home/Proof";
import { SolutionSection } from "@/components/home/Solution";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PolicyReadinessBanner />
      <ProblemSection />
      <SolutionSection />
      <PlatformSection />
      <ProofSection />
      <IndustriesSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
