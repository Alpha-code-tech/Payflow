'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const rows = [
  { feature: 'Available in Nigeria',    paypal: '❌', payoneer: '✅', payflow: '✅' },
  { feature: 'Conversion Fee',          paypal: 'N/A', payoneer: '2% + spread', payflow: '0.2% only' },
  { feature: 'Auto Rate Targeting',     paypal: '❌', payoneer: '❌', payflow: '✅' },
  { feature: 'Telegram Alerts',         paypal: '❌', payoneer: '❌', payflow: '✅' },
  { feature: 'Direct Bank Transfer',    paypal: '❌', payoneer: '✅', payflow: '✅' },
  { feature: 'Smart Contract Powered',  paypal: '❌', payoneer: '❌', payflow: '✅' },
  { feature: 'Setup Time',              paypal: 'N/A', payoneer: '3–5 days', payflow: '5 minutes' },
];

export default function WhyDifferent() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 bg-white/[0.015]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-widest text-[#00C896] font-semibold mb-4">Comparison</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Not Another Crypto App
          </h2>
          <p className="text-[#A0A0B8] text-lg max-w-xl mx-auto">
            Built specifically for Nigerian freelancers earning in foreign currency.
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="overflow-x-auto"
        >
          <div className="bg-white/[0.04] border border-white/8 rounded-2xl overflow-hidden min-w-[520px]">
            {/* Header row */}
            <div className="grid grid-cols-4 border-b border-white/8">
              <div className="px-6 py-4 text-xs uppercase tracking-wider text-[#A0A0B8] font-semibold">Feature</div>
              {['PayPal', 'Payoneer', 'PayFlow'].map((h, i) => (
                <div
                  key={h}
                  className={`px-6 py-4 text-sm font-bold text-center ${
                    i === 2
                      ? 'bg-gradient-to-b from-[#6C3AE8]/15 to-[#00C896]/10 text-transparent bg-clip-text'
                      : 'text-[#A0A0B8]'
                  }`}
                  style={i === 2 ? { background: 'linear-gradient(135deg, rgba(108,58,232,0.12), rgba(0,200,150,0.08))' } : {}}
                >
                  {i === 2 ? (
                    <span className="bg-gradient-to-r from-[#6C3AE8] to-[#00C896] bg-clip-text text-transparent font-bold">
                      {h} ✦
                    </span>
                  ) : h}
                </div>
              ))}
            </div>

            {/* Data rows */}
            {rows.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-4 border-b border-white/5 last:border-0 ${
                  i % 2 === 0 ? '' : 'bg-white/[0.015]'
                }`}
              >
                <div className="px-6 py-4 text-sm text-[#A0A0B8] font-medium">{row.feature}</div>
                <div className="px-6 py-4 text-sm text-[#A0A0B8] text-center">{row.paypal}</div>
                <div className="px-6 py-4 text-sm text-[#A0A0B8] text-center">{row.payoneer}</div>
                <div
                  className="px-6 py-4 text-sm text-center font-semibold"
                  style={{ background: 'linear-gradient(135deg, rgba(108,58,232,0.07), rgba(0,200,150,0.05))' }}
                >
                  <span className="text-[#00C896]">{row.payflow}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
