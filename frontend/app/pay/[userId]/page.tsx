'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://payflow-ud12.onrender.com';

export default function PayPage() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile]   = useState<any>(null);
  const [rate, setRate]         = useState<number | null>(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied]     = useState(false);
  const [sent, setSent]         = useState(false);
  const [sending, setSending]   = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [profRes, rateRes] = await Promise.all([
          fetch(`${SERVER_URL}/profile/${userId}`),
          fetch(`${SERVER_URL}/rate`),
        ]);
        if (!profRes.ok) { setNotFound(true); setLoading(false); return; }
        const { profile } = await profRes.json();
        const rateData    = await rateRes.json();
        setProfile(profile);
        if (rateData.rate) setRate(rateData.rate);
      } catch { setNotFound(true); }
      setLoading(false);
    }
    load();
  }, [userId]);

  async function copyAddress() {
    await navigator.clipboard.writeText(profile.vault_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function confirmPayment() {
    setSending(true);
    await fetch(`${SERVER_URL}/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from_address: profile.vault_address,
        usdc_amount: 0,
        tx_hash: `manual-${Date.now()}`,
        network: 'polygon',
      }),
    }).catch(() => {});
    setSent(true);
    setSending(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#6C3AE8] border-t-transparent animate-spin" />
      </main>
    );
  }

  if (notFound || !profile?.vault_address) {
    return (
      <main className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-5xl mb-4">🔍</p>
        <h1 className="text-xl font-bold text-white mb-2">Payment page not found</h1>
        <p className="text-[#A0A0B8] text-sm">This user has not set up their PayFlow vault yet.</p>
        <Link href="/" className="mt-6 text-[#6C3AE8] hover:text-[#00C896] transition text-sm font-medium">← Back to PayFlow</Link>
      </main>
    );
  }

  const displayName = profile.full_name || 'This freelancer';

  return (
    <main className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#6C3AE8]/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C3AE8] to-[#00C896] flex items-center justify-center shadow-lg shadow-[#6C3AE8]/30">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2.5 8.5L6.5 12L13.5 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#6C3AE8] to-[#00C896] bg-clip-text text-transparent">PayFlow</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Pay {displayName}</h1>
          <p className="text-[#A0A0B8] text-sm mt-1">Send USDC on the Polygon network</p>
        </div>

        {/* Rate */}
        <div className="mb-5 px-4 py-3 bg-[#00C896]/10 border border-[#00C896]/20 rounded-xl text-center">
          <span className="text-[#00C896] text-sm font-medium">
            {rate ? `Live Rate: 1 USDC = ₦${Number(rate).toLocaleString()}` : 'Fetching live rate…'}
          </span>
        </div>

        {/* QR */}
        <div className="flex justify-center mb-5">
          <div className="p-4 bg-white rounded-2xl shadow-lg">
            <QRCodeSVG value={profile.vault_address} size={160} level="M"/>
          </div>
        </div>

        {/* Address */}
        <div className="mb-5">
          <label className="block text-xs text-[#A0A0B8] mb-2 uppercase tracking-wider">Vault Address (Polygon)</label>
          <div className="flex items-center gap-2">
            <input readOnly value={profile.vault_address}
              className="flex-1 bg-white/5 border border-white/10 text-[#A0A0B8] text-xs font-mono rounded-xl px-4 py-3 truncate focus:outline-none cursor-default"/>
            <button onClick={copyAddress}
              className="px-4 py-3 bg-[#6C3AE8]/20 hover:bg-[#6C3AE8]/30 text-white text-sm rounded-xl transition whitespace-nowrap border border-[#6C3AE8]/30">
              {copied ? '✓' : 'Copy'}
            </button>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-6 p-4 bg-white/[0.03] border border-white/8 rounded-xl">
          <p className="text-white text-sm font-medium mb-3">How to pay</p>
          {[
            'Open your crypto wallet (MetaMask, Coinbase, etc.)',
            'Select USDC on the Polygon network',
            'Paste the vault address above',
            'Send your payment, then click the button below',
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-2.5 mb-2 last:mb-0">
              <span className="text-[#6C3AE8] text-xs font-bold shrink-0 mt-0.5">{i + 1}.</span>
              <span className="text-[#A0A0B8] text-sm">{s}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        {sent ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">✅</div>
            <p className="text-[#00C896] font-semibold text-lg">Payment Confirmed!</p>
            <p className="text-[#A0A0B8] text-sm mt-1">{displayName} has been notified. Thank you!</p>
          </div>
        ) : (
          <button onClick={confirmPayment} disabled={sending}
            className="w-full py-4 bg-gradient-to-r from-[#6C3AE8] to-[#00C896] text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {sending ? 'Notifying…' : '✓  I Have Sent the Payment'}
          </button>
        )}

        <p className="text-center text-xs text-[#A0A0B8]/50 mt-6">
          Powered by <span className="text-[#6C3AE8]">PayFlow</span> · Built on Kwala
        </p>
      </div>
    </main>
  );
}
