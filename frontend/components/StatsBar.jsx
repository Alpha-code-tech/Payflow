'use client';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

function useCountUp(end, inView, duration = 2000, decimals = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView || !end) return;
    const startTime = performance.now();
    const frame = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [inView, end, duration, decimals]);
  return count;
}

function StatItem({ stat, inView, index }) {
  const decimals = Number.isInteger(stat.value) ? 0 : 1;
  const count = useCountUp(stat.value, inView, 2200, decimals);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="flex flex-col items-center gap-1 px-6"
    >
      <span className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
        {stat.prefix}
        {stat.value >= 1000 ? count.toLocaleString() : count}
        {stat.suffix}
      </span>
      <span className="text-sm text-[#A0A0B8] font-medium text-center">{stat.label}</span>
    </motion.div>
  );
}

export default function StatsBar({ liveRate }) {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  const stats = [
    { value: 2.4,  suffix: 'M+', prefix: '$', label: 'Total Processed' },
    { value: 5200, suffix: '+',  prefix: '',  label: 'Freelancers Served' },
    { value: liveRate || 1620, suffix: '', prefix: '₦', label: 'Live NGN Rate' },
    { value: 0.2,  suffix: '%',  prefix: '',  label: 'Platform Fee' },
  ];

  return (
    <section ref={ref} className="relative py-14 border-y border-white/5 bg-white/[0.02]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-white/10">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} inView={inView} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
