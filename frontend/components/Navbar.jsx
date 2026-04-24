'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const links = [
  { label: 'Product',  href: '#solution' },
  { label: 'Problem',  href: '#problem' },
  { label: 'Solution', href: '#how-it-works' },
  { label: 'Pricing',  href: '#pricing' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [user, setUser]         = useState(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push('/');
    router.refresh();
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0A0A0F]/85 backdrop-blur-xl border-b border-white/5 shadow-xl shadow-black/40'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C3AE8] to-[#00C896] flex items-center justify-center shadow-lg shadow-[#6C3AE8]/30 group-hover:shadow-[#6C3AE8]/50 transition-shadow">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2.5 8.5L6.5 12L13.5 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#6C3AE8] to-[#00C896] bg-clip-text text-transparent">
              PayFlow
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a key={l.label} href={l.href}
                className="text-sm text-[#A0A0B8] hover:text-white transition-colors duration-200 font-medium">
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard"
                  className="text-sm text-[#A0A0B8] hover:text-white transition-colors font-medium px-3 py-2">
                  Dashboard
                </Link>
                <motion.button
                  onClick={handleSignOut}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2.5 text-sm font-medium text-[#A0A0B8] hover:text-white border border-white/15 hover:border-white/30 rounded-lg transition-all"
                >
                  Sign Out
                </motion.button>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-block px-4 py-2.5 text-sm font-medium text-[#A0A0B8] hover:text-white border border-white/15 hover:border-white/30 rounded-lg transition-all cursor-pointer"
                  >
                    Sign In
                  </motion.span>
                </Link>
                <Link href="/sign-up">
                  <motion.span
                    whileHover={{ scale: 1.03, boxShadow: '0 0 28px rgba(108,58,232,0.55)' }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-block px-5 py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-[#6C3AE8] to-[#00C896] cursor-pointer"
                  >
                    Get Started
                  </motion.span>
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="md:hidden flex flex-col justify-center gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            {[
              open ? { rotate: 45, y: 8 }  : { rotate: 0, y: 0 },
              open ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 },
              open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 },
            ].map((anim, i) => (
              <motion.span key={i} animate={anim} transition={{ duration: 0.25 }}
                className="block w-5 h-0.5 bg-white rounded-full origin-center" />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-[#0D0D16] border-l border-white/8 flex flex-col pt-20 px-6 gap-2 md:hidden"
            >
              {links.map((l) => (
                <a key={l.label} href={l.href} onClick={() => setOpen(false)}
                  className="text-base text-[#A0A0B8] hover:text-white transition-colors py-3 border-b border-white/5 font-medium">
                  {l.label}
                </a>
              ))}

              <div className="mt-6 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setOpen(false)}
                      className="px-6 py-3.5 text-center font-semibold text-white rounded-xl bg-gradient-to-r from-[#6C3AE8] to-[#00C896]">
                      Dashboard
                    </Link>
                    <button onClick={handleSignOut}
                      className="px-6 py-3 text-center font-medium text-[#A0A0B8] border border-white/15 rounded-xl hover:text-white transition-all">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/sign-in" onClick={() => setOpen(false)}
                      className="px-6 py-3 text-center font-medium text-[#A0A0B8] border border-white/15 rounded-xl hover:text-white transition-all">
                      Sign In
                    </Link>
                    <Link href="/sign-up" onClick={() => setOpen(false)}
                      className="px-6 py-3.5 text-center font-semibold text-white rounded-xl bg-gradient-to-r from-[#6C3AE8] to-[#00C896]">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
