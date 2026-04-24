'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const workflows = [
  { n: '01', title: 'Payment Detection', desc: 'Instantly detects USDC deposits to your vault on Polygon Amoy — no manual checking required.' },
  { n: '02', title: 'Live Rate Monitor', desc: 'Checks USD/NGN exchange rate every 5 minutes via real-time API so you always know the market.' },
  { n: '03', title: 'Smart Decision Gate', desc: 'Asks you on Telegram when your target rate is hit. You reply YES or NO — simple as that.' },
  { n: '04', title: 'Automatic Swap', desc: 'Executes USDC to NGN conversion via ERC-4337 smart wallet — trustless and non-custodial.' },
  { n: '05', title: 'Bank Transfer', desc: 'Sends NGN directly to your GTBank, Access Bank or any Nigerian bank account within hours.' },
  { n: '06', title: 'Dual Notification', desc: 'Confirms payment to both you and your client via Telegram instantly — full transparency.' },
];

export default function SolutionSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="solution" ref={ref} className="py-24 px-4 sm:px-6 bg-white/[0.015]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-widest text-[#00C896] font-semibold mb-4">The Solution</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            PayFlow Automates Everything
          </h2>
          <p className="text-[#A0A0B8] text-lg max-w-xl mx-auto">
            Six smart workflows running 24/7 so you never miss a payment or a good rate.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {workflows.map((wf, i) => (
            <motion.div
              key={wf.n}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{
                borderColor: 'rgba(0,200,150,0.5)',
                boxShadow: '0 0 40px rgba(0,200,150,0.12)',
                transition: { duration: 0.2 },
              }}
              className="relative p-6 rounded-2xl bg-white/[0.04] border border-white/8 backdrop-blur-sm overflow-hidden group"
            >
              {/* Green left accent */}
              <div className="absolute left-0 top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#6C3AE8] to-[#00C896] rounded-full" />

              <div className="ml-4">
                {/* Number badge */}
                <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-[#6C3AE8]/15 text-[#6C3AE8] border border-[#6C3AE8]/20 mb-4">
                  {wf.n}
                </span>

                <h3 className="text-white font-bold text-lg mb-2 leading-snug group-hover:text-[#00C896] transition-colors duration-300">
                  {wf.title}
                </h3>
                <p className="text-[#A0A0B8] text-sm leading-relaxed">{wf.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
