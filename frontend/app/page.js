'use client';
import { useState, useEffect } from 'react';
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

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://payflow-ud12.onrender.com';

export default function Home() {
  const [liveRate, setLiveRate] = useState(null);

  useEffect(() => {
    fetch(`${SERVER_URL}/rate`)
      .then(r => r.json())
      .then(d => { if (d.rate) setLiveRate(d.rate); })
      .catch(() => {});
  }, []);

  return (
    <main className="bg-[#0A0A0F] overflow-hidden">
      <Navbar />
      <Hero liveRate={liveRate} />
      <StatsBar liveRate={liveRate} />
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
