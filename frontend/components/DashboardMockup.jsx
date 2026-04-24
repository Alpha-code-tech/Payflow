'use client';
import { motion } from 'framer-motion';

export default function DashboardMockup() {
  return (
    <div className="relative w-full max-w-[360px]">
      {/* Purple glow */}
      <div className="absolute -inset-6 bg-[#6C3AE8]/25 rounded-3xl blur-[70px] pointer-events-none" />

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/50"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#A0A0B8] mb-1">PayFlow Dashboard</p>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C896] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C896]" />
              </span>
              <span className="text-xs text-[#00C896] font-medium">Live Monitoring</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C3AE8] to-[#00C896] flex items-center justify-center shadow-lg shadow-[#6C3AE8]/30">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M2 7.5L6 11L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Rate card */}
        <div className="mb-4 p-4 rounded-xl bg-[#00C896]/8 border border-[#00C896]/20">
          <p className="text-[10px] uppercase tracking-wider text-[#A0A0B8] mb-2">Current Rate</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#00C896]">₦1,348.99</span>
            <span className="text-sm text-[#A0A0B8]">/ $1</span>
          </div>
          <p className="text-xs text-[#00C896]/80 mt-1 flex items-center gap-1">
            <span>↑</span> +2.3% today
          </p>
        </div>

        {/* Mode toggle */}
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-wider text-[#A0A0B8] mb-2">Conversion Mode</p>
          <div className="flex rounded-lg bg-white/5 border border-white/8 p-1 gap-1">
            <button className="flex-1 py-2 text-xs text-[#A0A0B8] rounded-md transition-colors">
              Convert Now
            </button>
            <button className="flex-1 py-2 text-xs font-semibold text-white rounded-md bg-gradient-to-r from-[#6C3AE8] to-[#00C896]">
              Target Rate
            </button>
          </div>
        </div>

        {/* Target rate */}
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-wider text-[#A0A0B8] mb-2">Target Rate</p>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
            <span className="text-sm text-[#A0A0B8]">₦</span>
            <span className="text-sm font-bold text-white tracking-wide">1,650</span>
            <span className="ml-auto text-xs text-[#A0A0B8]">/ $1</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[10px] uppercase tracking-wider text-[#A0A0B8]">Rate Progress</p>
            <span className="text-xs font-bold text-[#00C896]">82%</span>
          </div>
          <div className="h-2 rounded-full bg-white/8 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '82%' }}
              transition={{ duration: 1.8, delay: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-[#6C3AE8] to-[#00C896]"
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#A0A0B8] mt-1">
            <span>₦1,348</span>
            <span>₦1,650</span>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#00C896]/8 border border-[#00C896]/20">
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-2 h-2 rounded-full bg-[#00C896] flex-shrink-0"
          />
          <span className="text-sm text-[#00C896] font-medium">Monitoring rate 24/7...</span>
        </div>
      </motion.div>
    </div>
  );
}
