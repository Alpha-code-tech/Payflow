'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const router = useRouter();

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8)  { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${location.origin}/auth/callback?next=/onboarding`,
      },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push('/onboarding');
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#6C3AE8]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-[#00C896]/6 rounded-full blur-[100px] pointer-events-none" />

      <Link href="/" className="flex items-center gap-2.5 mb-8 relative z-10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C3AE8] to-[#00C896] flex items-center justify-center shadow-lg shadow-[#6C3AE8]/30">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2.5 8.5L6.5 12L13.5 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-[#6C3AE8] to-[#00C896] bg-clip-text text-transparent">PayFlow</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md bg-white/[0.04] border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl shadow-black/50"
      >
        <h1 className="text-2xl font-bold text-white mb-1">Create your vault</h1>
        <p className="text-[#A0A0B8] text-sm mb-8">Start receiving USDC payments in minutes</p>

        {error && (
          <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#A0A0B8] mb-2 uppercase tracking-wider">Full Name</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Ade Johnson"
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C3AE8]/60 transition-all"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A0A0B8] mb-2 uppercase tracking-wider">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C3AE8]/60 transition-all"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A0A0B8] mb-2 uppercase tracking-wider">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min. 8 characters"
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C3AE8]/60 transition-all"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A0A0B8] mb-2 uppercase tracking-wider">Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C3AE8]/60 transition-all"/>
          </div>
          <motion.button type="submit" disabled={loading}
            whileHover={{ scale: 1.02, boxShadow: '0 0 28px rgba(108,58,232,0.45)' }} whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 bg-gradient-to-r from-[#6C3AE8] to-[#00C896] text-white font-semibold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed mt-2">
            {loading ? 'Creating account…' : 'Create Free Account'}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-[#A0A0B8]">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-[#6C3AE8] hover:text-[#00C896] transition-colors font-medium">Sign in</Link>
        </p>
      </motion.div>
    </main>
  );
}
