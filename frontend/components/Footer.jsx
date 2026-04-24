'use client';
import Link from 'next/link';

const columns = [
  {
    title: 'Product',
    links: ['Features', 'How it Works', 'Pricing', 'Security'],
  },
  {
    title: 'Company',
    links: ['About', 'Blog', 'Careers', 'Press'],
  },
  {
    title: 'Resources',
    links: ['Docs', 'API Reference', 'Status', 'Support'],
  },
  {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#060608] border-t border-white/5 pt-16 pb-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C3AE8] to-[#00C896] flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M2 7.5L6 11L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#6C3AE8] to-[#00C896] bg-clip-text text-transparent">
                PayFlow
              </span>
            </Link>
            <p className="text-[#A0A0B8] text-sm leading-relaxed mb-5">
              Get paid in USDC. Convert to Naira on your terms.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {[
                { label: 'Twitter/X', path: 'M4 4h7.5l-3 4 3.5 5H4.5L7 9 4 4z' },
                { label: 'Discord', path: 'M6 7c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm4 0c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zM7 3C4.24 3 2 5.24 2 8c0 3 2.24 6 5 6 .33 0 .66-.04.98-.1C8.6 14.56 9.77 15 11 15c1.93 0 3-1 3-3 0-.42-.08-.83-.22-1.22C14.55 9.97 15 8.54 15 7c0-2.21-1.79-4-4-4H7z' },
                { label: 'Telegram', path: 'M2 7.5L13 3l-4 9-2-3-3 2 1-3.5z' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/10 hover:border-white/15 transition-all duration-200"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d={s.path} stroke="#A0A0B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs uppercase tracking-widest text-[#A0A0B8] font-semibold mb-4">{col.title}</p>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-[#A0A0B8] hover:text-white transition-colors duration-200">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#A0A0B8] text-sm text-center sm:text-left">
            © 2026 PayFlow. Built with{' '}
            <span className="bg-gradient-to-r from-[#6C3AE8] to-[#00C896] bg-clip-text text-transparent font-semibold">
              Kwala
            </span>{' '}
            during the Schulltech Hackathon.
          </p>
          <p className="text-[#A0A0B8]/50 text-xs">Polygon Amoy · ERC-4337</p>
        </div>
      </div>
    </footer>
  );
}
