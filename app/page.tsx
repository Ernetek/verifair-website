import { FinalCTA } from "@/components/home/CTA";
import { CoordinatedSolutionSection } from "@/components/home/CoordinatedSolution";
import { FAQSection } from "@/components/home/FAQ";
import { HeroSection } from "@/components/home/Hero";
import { IndustriesSection } from "@/components/home/Industries";
import { PolicyReadinessBanner } from "@/components/home/PolicyReadinessBanner";
import { ProblemSection } from "@/components/home/Problem";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PolicyReadinessBanner />
      <ProblemSection />
      <CoordinatedSolutionSection />
      <IndustriesSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
