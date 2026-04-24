'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    billing: '/ month',
    fee: '0.3% per conversion',
    features: ['Up to $5,000/month', 'Manual conversion only', 'Telegram notifications', 'Email support'],
    cta: 'Get Started Free',
    popular: false,
    style: { border: 'rgba(255,255,255,0.1)', shadow: 'transparent' },
    ctaClass: 'border border-white/20 text-white hover:bg-white/5',
  },
  {
    name: 'Pro',
    price: '$0',
    billing: '/ month',
    fee: '0.2% per conversion',
    features: [
      'Unlimited volume',
      'Auto rate targeting',
      'Priority Telegram alerts',
      'Direct bank transfer',
      'Transaction history',
      'Priority support',
    ],
    cta: 'Start with Pro',
    popular: true,
    style: { border: '#6C3AE8', shadow: 'rgba(108,58,232,0.35)' },
    ctaClass: 'bg-gradient-to-r from-[#6C3AE8] to-[#00C896] text-white hover:opacity-90',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    billing: ' pricing',
    fee: 'Volume discounts available',
    features: [
      'Everything in Pro',
      'API access',
      'Custom integration support',
      'Dedicated account manager',
      'SLA guarantee',
    ],
    cta: 'Contact Us',
    popular: false,
    style: { border: 'rgba(234,179,8,0.4)', shadow: 'rgba(234,179,8,0.15)' },
    ctaClass: 'border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/5',
  },
];

export default function Pricing() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="pricing" ref={ref} className="py-24 px-4 sm:px-6 bg-white/[0.015]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-widest text-[#6C3AE8] font-semibold mb-4">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-[#A0A0B8] text-lg max-w-md mx-auto">
            No hidden fees. No monthly charges. Pay only when you convert.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.12 }}
              whileHover={{
                y: -6,
                boxShadow: `0 30px 80px ${plan.style.shadow}`,
                transition: { duration: 0.25 },
              }}
              style={{ borderColor: plan.style.border }}
              className={`relative p-8 rounded-2xl bg-white/[0.04] border backdrop-blur-sm flex flex-col gap-6 ${
                plan.popular ? 'md:-mt-4 md:mb-4' : ''
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 text-xs font-bold text-white bg-gradient-to-r from-[#6C3AE8] to-[#00C896] rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan name + price */}
              <div>
                <p className="text-[#A0A0B8] text-sm font-semibold uppercase tracking-wider mb-3">{plan.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-[#A0A0B8] text-sm">{plan.billing}</span>
                </div>
                <p className="text-[#00C896] text-sm font-medium mt-1">{plan.fee}</p>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/8" />

              {/* Features */}
              <ul className="flex flex-col gap-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-[#A0A0B8]">
                    <div className="w-4 h-4 rounded-full bg-[#00C896]/15 border border-[#00C896]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1 4L3.5 6.5L7 1.5" stroke="#00C896" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <motion.a
                href={plan.cta === 'Contact Us' ? 'mailto:hello@payflow.app' : '/sign-up'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`block w-full py-3.5 text-center text-sm font-semibold rounded-lg transition-all duration-300 ${plan.ctaClass}`}
              >
                {plan.cta}
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
