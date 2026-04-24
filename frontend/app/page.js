import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StatsBar from '@/components/StatsBar';
import ProblemSection from '@/components/ProblemSection';
import SolutionSection from '@/components/SolutionSection';
import HowItWorks from '@/components/HowItWorks';
import WhyDifferent from '@/components/WhyDifferent';
import WhoWeServe from '@/components/WhoWeServe';
import Pricing from '@/components/Pricing';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="bg-[#0A0A0F] overflow-hidden">
      <Navbar />
      <Hero />
      <StatsBar />
      <ProblemSection />
      <SolutionSection />
      <HowItWorks />
      <WhyDifferent />
      <WhoWeServe />
      <Pricing />
      <CTASection />
      <Footer />
    </main>
  );
}
