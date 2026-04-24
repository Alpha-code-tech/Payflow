'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

const BANKS = [
  { name: 'GTBank',        code: '058' },
  { name: 'Access Bank',   code: '044' },
  { name: 'Zenith Bank',   code: '057' },
  { name: 'First Bank',    code: '011' },
  { name: 'UBA',           code: '033' },
  { name: 'Fidelity Bank', code: '070' },
  { name: 'Sterling Bank', code: '232' },
];

export default function SettingsPage() {
  const [profile, setProfile]     = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState<string | null>(null);
  const [saved, setSaved]         = useState<string | null>(null);
  const [bankName, setBankName]   = useState('');
  const [bankCode, setBankCode]   = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName]     = useState('');
  const [telegramId, setTelegramId]       = useState('');
  const [mode, setMode]           = useState('immediate');
  const [targetRate, setTargetRate] = useState('');
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/sign-in'); return; }
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (prof) {
        setProfile(prof);
        setBankName(prof.bank_name || '');
        setBankCode(prof.bank_code || '');
        setAccountNumber(prof.account_number || '');
        setAccountName(prof.account_name || '');
        setTelegramId(prof.telegram_chat_id || '');
        setMode(prof.conversion_mode || 'immediate');
        setTargetRate(prof.target_rate?.toString() || '');
      }
      setLoading(false);
    });
  }, [router]);

  async function saveSection(section: string, updates: Record<string, unknown>) {
    setSaving(section);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('profiles').update(updates).eq('id', user.id);
    setSaving(null);
    setSaved(section);
    setTimeout(() => setSaved(null), 2500);
  }

  async function deleteAccount() {
    if (!confirm('Are you sure? This cannot be undone. Your account and all data will be permanently deleted.')) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  }

  const inputCls = 'w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C3AE8]/60 transition-all';
  const labelCls = 'block text-xs font-medium text-[#A0A0B8] mb-2 uppercase tracking-wider';

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#6C3AE8] border-t-transparent animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0F] px-4 py-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="text-[#A0A0B8] hover:text-white transition text-sm">← Dashboard</Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C3AE8] to-[#00C896] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M2.5 8.5L6.5 12L13.5 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-white">Settings</span>
          </div>
        </div>

        {/* ── Bank Details ──────────────────────────────────────────────── */}
        <div className="mb-6 p-6 bg-white/[0.03] border border-white/8 rounded-2xl">
          <h2 className="text-white font-semibold mb-5">Bank Details</h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Bank Name</label>
              <select value={bankName} onChange={e => {
                const bank = BANKS.find(b => b.name === e.target.value);
                setBankName(e.target.value);
                setBankCode(bank?.code || '');
              }} className={inputCls + ' cursor-pointer bg-[#0A0A0F]'}>
                <option value="" disabled>Select your bank</option>
                {BANKS.map(b => <option key={b.code} value={b.name}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Account Number</label>
              <input type="text" value={accountNumber}
                onChange={e => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                maxLength={10} placeholder="10-digit NUBAN" className={inputCls}/>
            </div>
            <div>
              <label className={labelCls}>Account Name</label>
              <input type="text" value={accountName} onChange={e => setAccountName(e.target.value)}
                placeholder="As on your bank statement" className={inputCls}/>
            </div>
          </div>
          <motion.button
            onClick={() => saveSection('bank', { bank_name: bankName, bank_code: bankCode, account_number: accountNumber, account_name: accountName })}
            disabled={saving === 'bank'}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="mt-5 px-6 py-3 bg-gradient-to-r from-[#6C3AE8] to-[#00C896] text-white text-sm font-semibold rounded-xl disabled:opacity-60 transition">
            {saving === 'bank' ? 'Saving…' : saved === 'bank' ? '✓ Saved!' : 'Save Bank Details'}
          </motion.button>
        </div>

        {/* ── Telegram ──────────────────────────────────────────────────── */}
        <div className="mb-6 p-6 bg-white/[0.03] border border-white/8 rounded-2xl">
          <h2 className="text-white font-semibold mb-2">Telegram Notifications</h2>
          <p className="text-[#A0A0B8] text-sm mb-5">Your chat ID is used to send you payment alerts via @PayFlowBot.</p>
          <div>
            <label className={labelCls}>Telegram Chat ID</label>
            <input type="text" value={telegramId} onChange={e => setTelegramId(e.target.value)}
              placeholder="e.g. 482951" className={inputCls}/>
          </div>
          <motion.button
            onClick={() => saveSection('telegram', { telegram_chat_id: telegramId })}
            disabled={saving === 'telegram'}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="mt-5 px-6 py-3 bg-gradient-to-r from-[#6C3AE8] to-[#00C896] text-white text-sm font-semibold rounded-xl disabled:opacity-60 transition">
            {saving === 'telegram' ? 'Saving…' : saved === 'telegram' ? '✓ Saved!' : 'Save Telegram ID'}
          </motion.button>
        </div>

        {/* ── Conversion Preferences ────────────────────────────────────── */}
        <div className="mb-6 p-6 bg-white/[0.03] border border-white/8 rounded-2xl">
          <h2 className="text-white font-semibold mb-5">Conversion Preferences</h2>
          <div className="flex gap-3 mb-4">
            {[['immediate', 'Convert Immediately'], ['target', 'Wait for Target Rate']].map(([val, label]) => (
              <button key={val} onClick={() => setMode(val)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition ${
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
              <label className={labelCls}>Target Rate (NGN per USDC)</label>
              <input type="number" value={targetRate} onChange={e => setTargetRate(e.target.value)}
                placeholder="e.g. 1700" className={inputCls}/>
            </div>
          )}
          <motion.button
            onClick={() => saveSection('prefs', { conversion_mode: mode, target_rate: mode === 'target' ? Number(targetRate) : null })}
            disabled={saving === 'prefs'}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-[#6C3AE8] to-[#00C896] text-white text-sm font-semibold rounded-xl disabled:opacity-60 transition">
            {saving === 'prefs' ? 'Saving…' : saved === 'prefs' ? '✓ Saved!' : 'Save Preferences'}
          </motion.button>
        </div>

        {/* ── Danger Zone ───────────────────────────────────────────────── */}
        <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
          <h2 className="text-red-400 font-semibold mb-2">Danger Zone</h2>
          <p className="text-[#A0A0B8] text-sm mb-5">Permanently delete your account and all associated data. This cannot be undone.</p>
          <button onClick={deleteAccount}
            className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold rounded-xl transition">
            Delete My Account
          </button>
        </div>

      </div>
    </main>
  );
}
