'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const steps = [
  {
    n: '1',
    color: '#6C3AE8',
    glow: 'rgba(108,58,232,0.3)',
    title: 'Share Your Vault Address',
    desc: 'Send your unique PayFlow payment address to your international client. They send USDC on Polygon — fast and cheap.',
  },
  {
    n: '2',
    color: '#3B82F6',
    glow: 'rgba(59,130,246,0.3)',
    title: 'Set Your Conversion Preference',
    desc: 'Choose to convert immediately or set a target NGN rate. PayFlow monitors the market 24/7 so you don\'t have to.',
  },
  {
    n: '3',
    color: '#00C896',
    glow: 'rgba(0,200,150,0.3)',
    title: 'Get Notified on Telegram',
    desc: 'When your rate is hit, PayFlow sends you a Telegram message. Reply YES to convert. Reply NO to wait.',
  },
  {
    n: '4',
    color: '#10B981',
    glow: 'rgba(16,185,129,0.3)',
    title: 'Receive NGN in Your Bank',
    desc: 'PayFlow converts your USDC and sends NGN directly to your Nigerian bank account within 2 hours.',
  },
];

export default function HowItWorks() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="how-it-works" ref={ref} className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-widest text-[#6C3AE8] font-semibold mb-4">Process</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            From Invoice to Naira in 4 Steps
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative grid md:grid-cols-4 gap-6">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-[2.6rem] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#6C3AE8] via-[#3B82F6] via-[#00C896] to-[#10B981] opacity-25" />

          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Number circle */}
              <motion.div
                whileHover={{ scale: 1.08, boxShadow: `0 0 40px ${step.glow}` }}
                style={{ background: step.color, boxShadow: `0 8px 32px ${step.glow}` }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-2xl font-bold text-white relative z-10 transition-shadow duration-300"
              >
                {step.n}
              </motion.div>

              <h3 className="text-white font-bold text-lg mb-3 leading-snug">{step.title}</h3>
              <p className="text-[#A0A0B8] text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
