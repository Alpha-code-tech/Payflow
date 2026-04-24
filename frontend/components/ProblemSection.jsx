'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Globe, Banknote, Clock } from 'lucide-react';

const problems = [
  {
    Icon: Globe,
    iconBg: 'rgba(239,68,68,0.15)',
    iconColor: '#EF4444',
    title: 'PayPal is Blocked in Nigeria',
    desc: 'Over 200 million Nigerians cannot access PayPal. International clients send payments that simply never arrive.',
    stat: '200M+ Nigerians affected',
    accent: '#EF4444',
    bg: 'rgba(239,68,68,0.06)',
    border: 'rgba(239,68,68,0.2)',
  },
  {
    Icon: Banknote,
    iconBg: 'rgba(249,115,22,0.15)',
    iconColor: '#F97316',
    title: 'Payoneer Takes Too Much',
    desc: '2% conversion fee plus an 8% exchange rate spread means you lose up to $120 on every $1,000 earned. That is your money.',
    stat: 'Up to 10% lost per transaction',
    accent: '#F97316',
    bg: 'rgba(249,115,22,0.06)',
    border: 'rgba(249,115,22,0.2)',
  },
  {
    Icon: Clock,
    iconBg: 'rgba(234,179,8,0.15)',
    iconColor: '#EAB308',
    title: 'You Miss the Best Rates',
    desc: 'The NGN rate changes every hour. Without automation you convert at whatever rate exists when you remember to check — not when it is best for you.',
    stat: 'Avg 6% better rate with automation',
    accent: '#EAB308',
    bg: 'rgba(234,179,8,0.06)',
    border: 'rgba(234,179,8,0.2)',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function ProblemSection() {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <section id="problem" ref={ref} className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-widest text-[#6C3AE8] font-semibold mb-4">The Problem</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto leading-tight">
            The Pain Every Nigerian Freelancer Knows
          </h2>
          <p className="text-[#A0A0B8] text-lg max-w-xl mx-auto">
            You did the work. Getting paid shouldn&apos;t be this hard.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              whileHover={{
                y: -4,
                boxShadow: `0 20px 60px ${p.accent}20`,
                transition: { duration: 0.25 },
              }}
              style={{ background: p.bg, borderColor: p.border }}
              className="relative p-7 rounded-2xl border backdrop-blur-sm overflow-hidden group cursor-default"
            >
              {/* Accent top bar */}
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ background: p.accent }} />

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: p.iconBg }}
              >
                <p.Icon size={24} color={p.iconColor} strokeWidth={1.75} />
              </div>

              <h3 className="text-white font-bold text-xl mb-3 leading-snug">{p.title}</h3>

              <p className="text-[#A0A0B8] text-sm leading-relaxed mb-6">{p.desc}</p>

              {/* Stat pill */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: `${p.accent}15`, color: p.accent, border: `1px solid ${p.accent}30` }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.accent }} />
                {p.stat}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
