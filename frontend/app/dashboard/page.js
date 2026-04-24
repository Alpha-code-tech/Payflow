'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://payflow-ud12.onrender.com';

const STATUS_STYLES = {
  received:                 'bg-blue-500/15 text-blue-400',
  converted:                'bg-purple-500/15 text-purple-400',
  processing_bank_transfer: 'bg-yellow-500/15 text-yellow-400',
  complete:                 'bg-emerald-500/15 text-emerald-400',
  failed:                   'bg-red-500/15 text-red-400',
};

const WORKFLOWS = [
  { n: '01', title: 'Payment Detection',  desc: 'Detects USDC deposits to your vault on Polygon Amoy' },
  { n: '02', title: 'Live Rate Monitor',  desc: 'Checks USD/NGN rate every 5 minutes via real-time API' },
  { n: '03', title: 'Smart Decision Gate',desc: 'Alerts you on Telegram when your target rate is hit' },
  { n: '04', title: 'Automatic Swap',     desc: 'Executes USDC → NGN via ERC-4337 smart wallet' },
  { n: '05', title: 'Bank Transfer',      desc: 'Sends NGN directly to your Nigerian bank account' },
  { n: '06', title: 'Dual Notification',  desc: 'Confirms payment to you and your client via Telegram' },
];

function fmt(n) { return Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 }); }

export default function DashboardPage() {
  const [user, setUser]               = useState(null);
  const [profile, setProfile]         = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [rate, setRate]               = useState(null);
  const [rateTime, setRateTime]       = useState(null);
  const [countdown, setCountdown]     = useState(30);
  const [mode, setMode]               = useState('immediate');
  const [targetRate, setTargetRate]   = useState('');
  const [modeSaved, setModeSaved]     = useState(false);
  const [copied, setCopied]           = useState(false);
  const [loading, setLoading]         = useState(true);
  const router = useRouter();

  // ── Fetch live rate ───────────────────────────────────────────────────
  const fetchRate = useCallback(async () => {
    try {
      const res = await fetch(`${SERVER_URL}/rate`);
      const data = await res.json();
      if (data.rate) { setRate(data.rate); setRateTime(new Date()); setCountdown(30); }
    } catch { /* keep previous */ }
  }, []);

  // ── Bootstrap auth + data ─────────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient();

    async function bootstrap() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/sign-in'); return; }
      setUser(user);

      const [{ data: prof }, { data: txs }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);

      if (prof) {
        setProfile(prof);
        setMode(prof.conversion_mode || 'immediate');
        setTargetRate(prof.target_rate?.toString() || '');
      }
      if (txs) setTransactions(txs);
      setLoading(false);
    }

    bootstrap();

    // Real-time transaction updates
    let channel;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      channel = supabase
        .channel('dashboard-transactions')
        .on('postgres_changes', {
          event: '*', schema: 'public', table: 'transactions',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          setTransactions(prev => {
            if (payload.eventType === 'INSERT') return [payload.new, ...prev];
            if (payload.eventType === 'UPDATE') return prev.map(t => t.id === payload.new.id ? payload.new : t);
            if (payload.eventType === 'DELETE') return prev.filter(t => t.id !== payload.old.id);
            return prev;
          });
        })
        .subscribe();
    });

    return () => { if (channel) supabase.removeChannel(channel); };
  }, [router]);

  // ── Rate polling ──────────────────────────────────────────────────────
  useEffect(() => {
    fetchRate();
    const iv = setInterval(fetchRate, 30000);
    return () => clearInterval(iv);
  }, [fetchRate]);

  // ── Countdown ─────────────────────────────────────────────────────────
  useEffect(() => {
    const tick = setInterval(() => setCountdown(c => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(tick);
  }, [rateTime]);

  // ── Save conversion mode ──────────────────────────────────────────────
  async function saveMode() {
    if (!user) return;
    const supabase = createClient();
    await supabase.from('profiles').update({
      conversion_mode: mode,
      target_rate: mode === 'target' ? Number(targetRate) : null,
    }).eq('id', user.id);

    await fetch(`${SERVER_URL}/decision`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, mode, target_rate: mode === 'target' ? Number(targetRate) : null }),
    }).catch(() => {});

    setModeSaved(true);
    setTimeout(() => setModeSaved(false), 2500);
  }

  async function handleSignOut() {
    await createClient().auth.signOut();
    router.push('/');
    router.refresh();
  }

  async function copyAddress() {
    if (!profile?.vault_address) return;
    await navigator.clipboard.writeText(profile.vault_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Derived stats ─────────────────────────────────────────────────────
  const totalUSDC = transactions.reduce((s, t) => s + Number(t.usdc_amount || 0), 0);
  const totalNGN  = transactions
    .filter(t => t.status === 'complete' || t.status === 'converted')
    .reduce((s, t) => s + Number(t.ngn_amount || 0), 0);
  const feesSaved = totalNGN * 0.098;
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';
  const payLink = typeof window !== 'undefined' ? `${window.location.origin}/pay/${user?.id}` : '';

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#6C3AE8] border-t-transparent animate-spin" />
          <p className="text-[#A0A0B8] text-sm">Loading your dashboard…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0F] px-4 py-6">
      <div className="max-w-4xl mx-auto">

        {/* ── Navbar ───────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C3AE8] to-[#00C896] flex items-center justify-center shadow-lg shadow-[#6C3AE8]/30">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2.5 8.5L6.5 12L13.5 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#6C3AE8] to-[#00C896] bg-clip-text text-transparent">PayFlow</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-white text-sm font-medium">{displayName}</p>
              <p className="text-[#A0A0B8] text-xs">{user?.email}</p>
            </div>
            <Link href="/settings" className="text-xs text-[#A0A0B8] hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition">
              Settings
            </Link>
            <button onClick={handleSignOut} className="text-xs text-[#A0A0B8] hover:text-red-400 border border-white/10 px-3 py-1.5 rounded-lg transition">
              Sign Out
            </button>
          </div>
        </div>

        {/* ── Welcome ──────────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Welcome back, {displayName} 👋</h1>
          <p className="text-[#A0A0B8] text-sm mt-1">Here is your payment overview</p>
        </div>

        {/* ── Stats ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Received', value: `${totalUSDC.toFixed(2)} USDC`, color: 'text-white' },
            { label: 'Total Converted', value: totalNGN > 0 ? `₦${fmt(totalNGN)}` : '—', color: 'text-emerald-400' },
            { label: 'Live Rate', value: rate ? `₦${fmt(rate)}` : '—', color: 'text-[#6C3AE8]' },
            { label: 'Fees Saved vs Payoneer', value: feesSaved > 0 ? `₦${fmt(feesSaved)}` : '—', color: 'text-[#00C896]' },
          ].map(stat => (
            <div key={stat.label} className="p-5 bg-white/[0.03] border border-white/8 rounded-2xl">
              <p className="text-xs text-[#A0A0B8] mb-2 uppercase tracking-wider">{stat.label}</p>
              <p className={`text-xl font-bold tabular-nums ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* ── Vault Address ──────────────────────────────────────────── */}
          <div className="p-5 bg-white/[0.03] border border-white/8 rounded-2xl">
            <h2 className="text-white font-semibold mb-4">Your Vault Address</h2>
            {profile?.vault_address ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white rounded-xl">
                    <QRCodeSVG value={profile.vault_address} size={120} level="M"/>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <input readOnly value={profile.vault_address}
                    className="flex-1 bg-white/5 border border-white/10 text-[#A0A0B8] text-xs font-mono rounded-xl px-3 py-2.5 truncate focus:outline-none cursor-default"/>
                  <button onClick={copyAddress}
                    className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs rounded-xl transition whitespace-nowrap">
                    {copied ? '✓' : 'Copy'}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { navigator.clipboard.writeText(payLink); }}
                    className="flex-1 py-2 text-xs text-[#A0A0B8] hover:text-white border border-white/10 rounded-lg transition">
                    Copy Pay Link
                  </button>
                  <Link href={`/pay/${user?.id}`}
                    className="flex-1 py-2 text-xs text-center text-[#6C3AE8] hover:text-[#00C896] border border-[#6C3AE8]/30 rounded-lg transition">
                    Preview Page →
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-[#A0A0B8] text-sm mb-4">Connect your wallet to get your vault address</p>
                <Link href="/onboarding"
                  className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#6C3AE8] to-[#00C896] text-white text-sm font-semibold rounded-xl">
                  Complete Setup
                </Link>
              </div>
            )}
          </div>

          {/* ── Live Rate + Conversion Mode ────────────────────────────── */}
          <div className="p-5 bg-white/[0.03] border border-white/8 rounded-2xl flex flex-col gap-5">
            {/* Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-white font-semibold">Live USD/NGN Rate</h2>
                <span className="text-xs text-[#A0A0B8] tabular-nums">Refreshes in {countdown}s</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-white tabular-nums">
                  {rate ? `₦${fmt(rate)}` : '—'}
                </span>
                <span className="text-[#A0A0B8] text-sm mb-1">per USDC</span>
              </div>
              {rateTime && <p className="text-xs text-[#A0A0B8]/60 mt-1">Updated {rateTime.toLocaleTimeString()}</p>}
            </div>

            <div className="h-px bg-white/8" />

            {/* Mode toggle */}
            <div>
              <h2 className="text-white font-semibold mb-3">Conversion Mode</h2>
              <div className="flex gap-2 mb-4">
                {[['immediate', 'Convert Now'], ['target', 'Target Rate']].map(([val, label]) => (
                  <button key={val} onClick={() => setMode(val)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${
                      mode === val
                        ? val === 'immediate' ? 'bg-[#6C3AE8] text-white' : 'bg-[#00C896] text-white'
                        : 'bg-white/5 text-[#A0A0B8] hover:text-white'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
              {mode === 'target' && (
                <div className="mb-4">
                  <label className="block text-xs text-[#A0A0B8] mb-2 uppercase tracking-wider">Target Rate (NGN per USDC)</label>
                  <input type="number" value={targetRate} onChange={e => setTargetRate(e.target.value)}
                    placeholder={rate ? `Current: ₦${fmt(rate)}` : 'e.g. 1700'}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C3AE8]/60 placeholder-white/20 transition"/>
                </div>
              )}
              <button onClick={saveMode}
                className="w-full py-3 bg-gradient-to-r from-[#6C3AE8] to-[#00C896] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition">
                {modeSaved ? '✓ Saved!' : 'Save Preference'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Transactions ─────────────────────────────────────────────── */}
        <div className="mb-6 p-5 bg-white/[0.03] border border-white/8 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Transaction History</h2>
            <span className="text-xs text-[#A0A0B8] px-2 py-1 bg-white/5 rounded-full">Live</span>
          </div>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-[#A0A0B8] text-sm">No transactions yet.</p>
              <p className="text-[#A0A0B8]/60 text-xs mt-1">Share your payment page to receive USDC.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#6C3AE8]/20 flex items-center justify-center text-sm font-bold text-[#6C3AE8] shrink-0">
                      $
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium font-mono truncate">{tx.from_address?.slice(0, 10)}…</p>
                      <p className="text-[#A0A0B8] text-xs">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-white text-sm font-semibold">{tx.usdc_amount} USDC</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[tx.status] || 'bg-white/10 text-white/60'}`}>
                      {tx.status?.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Kwala Workflows ──────────────────────────────────────────── */}
        <div className="p-5 bg-white/[0.03] border border-white/8 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Kwala Workflows</h2>
            <span className="text-xs text-emerald-400 px-2 py-1 bg-emerald-400/10 border border-emerald-400/20 rounded-full">6 Active</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {WORKFLOWS.map(w => (
              <div key={w.n} className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                <span className="text-xs font-bold text-[#6C3AE8] bg-[#6C3AE8]/15 px-2 py-1 rounded-lg shrink-0">{w.n}</span>
                <div>
                  <p className="text-white text-sm font-medium">{w.title}</p>
                  <p className="text-[#A0A0B8] text-xs leading-relaxed mt-0.5">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
