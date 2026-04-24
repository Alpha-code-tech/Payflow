'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const serves = [
  'Freelance designers, developers, writers',
  'Remote workers paid in USD/USDC',
  'Nigerian contractors for international companies',
  'Digital agencies receiving foreign payments',
  'Content creators with global audiences',
];

export default function WhoWeServe() {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-widest text-[#6C3AE8] font-semibold mb-4">Who We Serve</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Built for Ade and 5 Million Like Him
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* Persona card */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="p-8 rounded-2xl bg-white/[0.04] border border-white/8 backdrop-blur-sm flex flex-col gap-6"
          >
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6C3AE8] to-[#00C896] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#6C3AE8]/25">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="10" r="5" fill="white" fillOpacity="0.9" />
                  <path d="M4 26c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="white" strokeWidth="2" strokeLinecap="round" fillOpacity="0.9" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-lg">Ade Johnson</p>
                <p className="text-[#A0A0B8] text-sm">UX Designer — Lagos, Nigeria</p>
              </div>
            </div>

            {/* Quote */}
            <div className="relative">
              <div className="absolute -top-2 -left-1 text-5xl text-[#6C3AE8]/30 font-serif leading-none">&ldquo;</div>
              <p className="text-[#A0A0B8] text-base leading-relaxed pl-5 italic">
                I was losing{' '}
                <span className="text-white font-semibold not-italic">₦180,000 every month</span> to bad
                exchange rates and Payoneer fees. PayFlow gave me back control of my own money.
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {['#Freelancer', '#Lagos', '#UXDesigner'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium text-[#6C3AE8] bg-[#6C3AE8]/10 border border-[#6C3AE8]/20 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Who list */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="p-8 rounded-2xl bg-white/[0.04] border border-white/8 backdrop-blur-sm flex flex-col justify-center gap-5"
          >
            <p className="text-[#A0A0B8] text-sm uppercase tracking-widest font-semibold">PayFlow is built for</p>
            {serves.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-[#00C896]/15 border border-[#00C896]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#00C896" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-white text-base leading-snug">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
