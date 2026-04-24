'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DashboardMockup from './DashboardMockup';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.25 } },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const headlines = ['Get Paid in USDC.', 'Convert to Naira', 'On Your Terms.'];

export default function Hero({ liveRate }) {
  const pills = [
    '0.2% Fee',
    liveRate ? `₦${Number(liveRate).toLocaleString()} Live Rate` : '₦1,620 Live Rate',
    '2hr Settlement',
  ];

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 pb-16 px-4 sm:px-6 overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[15%] w-[700px] h-[500px] bg-[#6C3AE8]/12 rounded-full blur-[130px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[400px] bg-[#00C896]/8 rounded-full blur-[110px]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Left */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-7"
        >
          {/* Badge */}
          <motion.div variants={item}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C896] opacity-70" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C896]" />
              </span>
              <span className="text-xs text-[#A0A0B8] font-medium tracking-wide">
                Built on Kwala · Polygon Amoy
              </span>
            </div>
          </motion.div>

          {/* Headlines */}
          <div className="flex flex-col gap-0.5">
            {headlines.map((line, i) => (
              <motion.h1
                key={i}
                variants={item}
                className="text-4xl sm:text-5xl lg:text-[3.6rem] font-bold leading-[1.1] tracking-tight text-white"
              >
                {i === 0 ? (
                  <span className="bg-gradient-to-r from-[#6C3AE8] via-purple-400 to-[#00C896] bg-clip-text text-transparent">
                    {line}
                  </span>
                ) : (
                  line
                )}
              </motion.h1>
            ))}
          </div>

          {/* Subtitle */}
          <motion.p variants={item} className="text-[#A0A0B8] text-lg leading-relaxed max-w-[480px]">
            PayFlow lets Nigerian freelancers receive international USDC payments and automatically
            convert to Naira when the exchange rate hits your target.{' '}
            <span className="text-white/70">No Payoneer. No PayPal. No high fees.</span>
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
            <motion.div whileHover={{ scale: 1.03, boxShadow: '0 0 36px rgba(108,58,232,0.6)' }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/sign-up"
                className="block px-7 py-4 font-semibold text-white rounded-lg bg-gradient-to-r from-[#6C3AE8] to-[#00C896] text-center text-base shadow-lg shadow-[#6C3AE8]/20 transition-all duration-300"
              >
                Start Receiving Payments
              </Link>
            </motion.div>
            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-4 font-semibold text-white rounded-lg border border-white/20 text-center text-base transition-all duration-300"
            >
              See How It Works
            </motion.a>
          </motion.div>

          {/* Stat pills */}
          <motion.div variants={item} className="flex flex-wrap gap-2.5">
            {pills.map((pill) => (
              <span
                key={pill}
                className="px-3.5 py-1.5 text-sm text-[#A0A0B8] bg-white/5 border border-white/8 rounded-full font-medium"
              >
                {pill}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
          className="flex justify-center lg:justify-end"
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  );
}
