'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const badges = ['🔒 Non-custodial', '⚡ Powered by Kwala', '🇳🇬 Built for Nigeria'];

export default function CTASection() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section
      ref={ref}
      className="relative py-28 px-4 sm:px-6 overflow-hidden"
    >
      {/* Diagonal gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6C3AE8]/80 via-[#4B2AA8] to-[#00C896]/70" />

      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#00C896]/20 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight"
        >
          Stop Losing Money on Every Payment
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="text-white/75 text-lg mb-10 leading-relaxed"
        >
          Join 5,000+ Nigerian freelancers who receive international payments on their own terms.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.22 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.a
            href="#"
            whileHover={{ scale: 1.04, boxShadow: '0 0 50px rgba(255,255,255,0.25)' }}
            whileTap={{ scale: 0.97 }}
            className="px-9 py-4 bg-white text-[#6C3AE8] font-bold text-lg rounded-xl shadow-xl hover:bg-white/95 transition-all duration-300"
          >
            Create Your Free Vault →
          </motion.a>
          <p className="text-white/50 text-sm">
            No credit card. No KYC delays. Setup in 5 minutes.
          </p>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-wrap justify-center gap-4 mt-10"
        >
          {badges.map((b) => (
            <span
              key={b}
              className="px-4 py-2 text-sm text-white/80 bg-white/10 border border-white/15 rounded-full font-medium backdrop-blur-sm"
            >
              {b}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
