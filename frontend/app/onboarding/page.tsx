'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://payflow-ud12.onrender.com';

const BANKS = [
  { name: 'GTBank',        code: '058' },
  { name: 'Access Bank',   code: '044' },
  { name: 'Zenith Bank',   code: '057' },
  { name: 'First Bank',    code: '011' },
  { name: 'UBA',           code: '033' },
  { name: 'Fidelity Bank', code: '070' },
  { name: 'Sterling Bank', code: '232' },
];

const STEPS = ['Connect Wallet', 'Bank Details', 'Telegram Setup'];

export default function OnboardingPage() {
  const [step, setStep]                   = useState(1);
  const [user, setUser]                   = useState<any>(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [vaultAddress, setVaultAddress]   = useState('');
  const [bankName, setBankName]           = useState('');
  const [bankCode, setBankCode]           = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName]     = useState('');
  const [telegramCode, setTelegramCode]   = useState('');
  const router = useRouter();

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/sign-in'); return; }
      setUser(data.user);
    });
  }, [router]);

  async function saveToProfile(updates: Record<string, unknown>) {
    if (!user) return;
    const res = await fetch(`${SERVER_URL}/profile/${user.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to save profile');
  }

  async function connectWallet() {
    setError('');
    const eth = (window as any).ethereum;
    if (!eth) {
      setError('MetaMask not found. Please install the MetaMask browser extension.');
      return;
    }
    setLoading(true);
    try {
      const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      setVaultAddress(address);
      await saveToProfile({ vault_address: address });
    } catch (e: any) {
      setError(e.message || 'Wallet connection failed');
    }
    setLoading(false);
  }

  async function saveBank(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (accountNumber.length !== 10) { setError('Account number must be exactly 10 digits.'); return; }
    setLoading(true);
    try {
      await saveToProfile({ bank_name: bankName, bank_code: bankCode, account_number: accountNumber, account_name: accountName });
      setStep(3);
    } catch (e: any) {
      setError(e.message || 'Failed to save bank details');
    }
    setLoading(false);
  }

  async function saveTelegram(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (telegramCode.length !== 6) { setError('Please enter the 6-digit code from the bot.'); return; }
    setLoading(true);
    try {
      await saveToProfile({ telegram_chat_id: telegramCode });
      router.push('/dashboard');
    } catch (e: any) {
      setError(e.message || 'Failed to verify Telegram');
    }
    setLoading(false);
  }

  const inputCls = 'w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C3AE8]/60 transition-all';
  const labelCls = 'block text-xs font-medium text-[#A0A0B8] mb-2 uppercase tracking-wider';

  return (
    <main className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#6C3AE8]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C3AE8] to-[#00C896] flex items-center justify-center shadow-lg shadow-[#6C3AE8]/30">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2.5 8.5L6.5 12L13.5 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-[#6C3AE8] to-[#00C896] bg-clip-text text-transparent">PayFlow</span>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const done = step > n;
            const active = step === n;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 transition-opacity ${active || done ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                    done   ? 'bg-[#00C896] border-[#00C896] text-white' :
                    active ? 'border-[#6C3AE8] text-[#6C3AE8] bg-[#6C3AE8]/10' :
                             'border-white/20 text-white/40'
                  }`}>
                    {done ? '✓' : n}
                  </div>
                  <span className="text-xs text-[#A0A0B8] hidden sm:block">{label}</span>
                </div>
                {i < STEPS.length - 1 && <div className="w-6 h-px bg-white/10 mx-1" />}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="bg-white/[0.04] border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl shadow-black/50"
          >
            {error && (
              <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
            )}

            {/* STEP 1 — WALLET */}
            {step === 1 && (
              <div>
                <div className="text-4xl mb-4">🦊</div>
                <h2 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h2>
                <p className="text-[#A0A0B8] text-sm mb-8 leading-relaxed">
                  Connect your MetaMask wallet to generate your unique PayFlow vault address.
                  International clients will send USDC to this address.
                </p>
                {vaultAddress && (
                  <div className="mb-5 p-4 bg-[#00C896]/10 border border-[#00C896]/20 rounded-xl">
                    <p className="text-xs text-[#00C896] mb-1 font-semibold">Connected ✓</p>
                    <p className="text-white text-xs font-mono break-all">{vaultAddress}</p>
                  </div>
                )}
                <motion.button onClick={connectWallet} disabled={loading}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 bg-gradient-to-r from-[#6C3AE8] to-[#00C896] text-white font-semibold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? 'Connecting…' : vaultAddress ? 'Reconnect Wallet' : 'Connect MetaMask'}
                </motion.button>
                {vaultAddress && (
                  <motion.button onClick={() => { setError(''); setStep(2); }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full mt-3 py-3.5 border border-white/15 text-white font-semibold rounded-xl hover:bg-white/5 transition">
                    Continue →
                  </motion.button>
                )}
              </div>
            )}

            {/* STEP 2 — BANK */}
            {step === 2 && (
              <form onSubmit={saveBank}>
                <div className="text-4xl mb-4">🏦</div>
                <h2 className="text-xl font-bold text-white mb-2">Bank Details</h2>
                <p className="text-[#A0A0B8] text-sm mb-8">Where should we send your converted Naira?</p>
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Bank Name</label>
                    <select value={bankName} onChange={e => {
                      const bank = BANKS.find(b => b.name === e.target.value);
                      setBankName(e.target.value);
                      setBankCode(bank?.code || '');
                    }} required
                      className={inputCls + ' cursor-pointer bg-[#0A0A0F]'}>
                      <option value="" disabled>Select your bank</option>
                      {BANKS.map(b => <option key={b.code} value={b.name}>{b.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Account Number</label>
                    <input type="text" value={accountNumber}
                      onChange={e => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      required maxLength={10} placeholder="10-digit NUBAN" className={inputCls}/>
                  </div>
                  <div>
                    <label className={labelCls}>Account Name</label>
                    <input type="text" value={accountName} onChange={e => setAccountName(e.target.value)}
                      required placeholder="As it appears on your bank statement" className={inputCls}/>
                  </div>
                </div>
                <motion.button type="submit" disabled={loading}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 py-3.5 bg-gradient-to-r from-[#6C3AE8] to-[#00C896] text-white font-semibold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? 'Saving…' : 'Save & Continue →'}
                </motion.button>
              </form>
            )}

            {/* STEP 3 — TELEGRAM */}
            {step === 3 && (
              <form onSubmit={saveTelegram}>
                <div className="text-4xl mb-4">✈️</div>
                <h2 className="text-xl font-bold text-white mb-2">Telegram Setup</h2>
                <p className="text-[#A0A0B8] text-sm mb-6">Get instant payment alerts on Telegram.</p>
                <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                  {[
                    'Search @PayFlowBot on Telegram',
                    'Send /start to the bot',
                    'The bot will send you a 6-digit code',
                    'Enter that code below',
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#6C3AE8]/20 text-[#6C3AE8] text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-[#A0A0B8] text-sm">{s}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <label className={labelCls}>6-Digit Code</label>
                  <input type="text" value={telegramCode}
                    onChange={e => setTelegramCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required maxLength={6} placeholder="482951"
                    className={inputCls + ' text-center text-2xl tracking-[0.5em] font-mono'}/>
                </div>
                <motion.button type="submit" disabled={loading}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 py-3.5 bg-gradient-to-r from-[#6C3AE8] to-[#00C896] text-white font-semibold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? 'Verifying…' : 'Verify & Go to Dashboard →'}
                </motion.button>
                <button type="button" onClick={() => router.push('/dashboard')}
                  className="w-full mt-3 py-3 text-sm text-[#A0A0B8] hover:text-white transition text-center">
                  Skip for now
                </button>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
