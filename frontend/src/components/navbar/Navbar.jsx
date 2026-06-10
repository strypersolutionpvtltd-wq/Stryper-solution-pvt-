import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { COMPANY_INFO } from '@/data/companyInfo';
import NavLinks from './NavLinks';
import MobileMenu from './MobileMenu';
import Logo from '@/components/shared/Logo';
import AuthModal from '@/components/auth/AuthModal';
import CandidateNavMenu from '@/career-hub/components/shared/CandidateNavMenu';
import { useAuth } from '@/context/AuthContext';

// Simple dropdown for company users
const CompanyNavMenu = () => {
  const [open, setOpen] = useState(false);
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const email = userData?.email || '';
  const name = email.split('@')[0] || 'Company';
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className="relative" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>
      <button onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ background: 'linear-gradient(135deg, #8B3A8F, #b05ab5)' }}>{initials}</div>
        <div className="hidden xl:block text-left">
          <p className="text-xs font-semibold text-white leading-tight">{name}</p>
          <p className="text-[10px] text-white/60 leading-tight">Employer</p>
        </div>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden z-50">
            <div className="py-1">
              <button onClick={() => { navigate('/hire-zone/dashboard'); setOpen(false); }}
                className="flex w-full items-center px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">Dashboard</button>
              <button onClick={() => { navigate('/hire-zone/company-profile'); setOpen(false); }}
                className="flex w-full items-center px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">Company Profile</button>
              <button onClick={() => { navigate('/hire-zone/post-job'); setOpen(false); }}
                className="flex w-full items-center px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">Post a Job</button>
            </div>
            <div className="border-t border-neutral-50 py-1">
              <button onClick={() => { logout(); setOpen(false); }}
                className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">Sign out</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple dropdown for admin users
const AdminNavMenu = () => {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>
      <button onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold bg-red-600">AD</div>
        <div className="hidden xl:block text-left">
          <p className="text-xs font-semibold text-white leading-tight">Admin</p>
          <p className="text-[10px] text-white/60 leading-tight">Administrator</p>
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden z-50">
            <div className="py-1">
              <button onClick={() => { navigate('/admin/dashboard'); setOpen(false); }}
                className="flex w-full items-center px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">Admin Dashboard</button>
            </div>
            <div className="border-t border-neutral-50 py-1">
              <button onClick={() => { logout(); setOpen(false); }}
                className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">Sign out</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Navbar :
 * 1. Top info bar (phone, email, socials)
 * 2. White main navbar with logo + nav + CTA
 */
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ open: false, view: 'signin' });
  const { isLoggedIn, userRole } = useAuth();

  const isCandidate = isLoggedIn && userRole?.toUpperCase() === 'CANDIDATE';
  const isCompany = isLoggedIn && userRole?.toUpperCase() === 'COMPANY';
  const isAdmin = isLoggedIn && userRole?.toUpperCase() === 'ADMIN';

  const openSignIn = () => setAuthModal({ open: true, view: 'signin' });
  const openSignUp = () => setAuthModal({ open: true, view: 'signup-choice' });
  const closeAuth  = () => setAuthModal(p => ({ ...p, open: false }));

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">

        {/* ── Top info bar ── */}
        <div className="hidden lg:block text-white text-xs" style={{ background: '#8B3A8F' }}>
          <div className="container-base flex items-center justify-between h-9">
            {/* Left: contact info */}
            <div className="flex items-center gap-5">
              <a href={`tel:${COMPANY_INFO.phone}`} className="flex items-center gap-1.5 text-white/85 hover:text-white transition-colors">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M1.5 2C1.5 1.72 1.72 1.5 2 1.5h1.5l.75 1.88-1.13.75c.38 1.13 1.5 2.25 2.63 2.63l.75-1.13L8.38 6.5V8c0 .28-.22.5-.5.5C3.86 8.5 1.5 6.14 1.5 3.5V2z" stroke="white" strokeWidth="1.1" strokeLinejoin="round"/>
                </svg>
                {COMPANY_INFO.phone}
              </a>
              <span className="text-white/30">|</span>
              <a href={`mailto:${COMPANY_INFO.email}`} className="flex items-center gap-1.5 text-white/85 hover:text-white transition-colors">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <rect x="1" y="2.5" width="10" height="7" rx="1.2" stroke="white" strokeWidth="1.1"/>
                  <path d="M1 3.5l5 3 5-3" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
                </svg>
                {COMPANY_INFO.email}
              </a>
            </div>
            {/* Right: auth buttons */}
            <div className="flex items-center gap-3">
            </div>
          </div>
        </div>

        {/* ── Main navbar ── */}
        <motion.header
          initial={false} // Disable entry animation on mount to prevent blinking during route changes
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={[
            'bg-black transition-shadow duration-300',
            isScrolled ? 'shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] border-b border-white/5' : 'border-b border-white/10',
          ].join(' ')}
          role="banner"
        >
          <div className="container-base">
            <div className="flex items-center justify-between h-[68px]">

              <Logo />

              <nav className="hidden lg:flex items-center" aria-label="Main navigation">
                <NavLinks />
              </nav>

              <div className="flex items-center gap-3">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={isCandidate ? 'candidate-menu' : 'login-btn'}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="hidden lg:block" 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.97 }}
                  >
                  {isCandidate ? (
                      <CandidateNavMenu />
                    ) : isCompany ? (
                      <CompanyNavMenu />
                    ) : isAdmin ? (
                      <AdminNavMenu />
                    ) : (
                      <button
                        onClick={openSignIn}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors duration-200"
                        style={{ background: '#8B3A8F' }}>
                        Company Login
                      </button>
                    )}
                  </motion.div>
                </AnimatePresence>

                <button
                  className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                  onClick={() => setMobileOpen(p => !p)}
                  aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isMobileOpen}
                  aria-controls="mobile-menu"
                >
                  <HamburgerIcon open={isMobileOpen} />
                </button>
              </div>
            </div>
          </div>
        </motion.header>
      </div>

      <AnimatePresence mode="wait">
        {isMobileOpen && <MobileMenu id="mobile-menu" onClose={() => setMobileOpen(false)} onSignIn={openSignIn} onSignUp={openSignUp} />}
      </AnimatePresence>

      <AuthModal
        isOpen={authModal.open}
        onClose={closeAuth}
        defaultView={authModal.view}
      />
    </>
  );
};

const HamburgerIcon = ({ open }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="overflow-visible">
    <motion.rect x="2" y="5" width="16" height="1.8" rx="0.9" fill="currentColor"
      animate={open ? { rotate: 45, y: 4.1 } : { rotate: 0, y: 0 }}
      style={{ originX: '10px', originY: '5.9px' }}
      transition={{ duration: 0.25, ease: 'easeInOut' }} />
    <motion.rect x="2" y="9.1" width="16" height="1.8" rx="0.9" fill="currentColor"
      animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
      style={{ originX: '10px', originY: '10px' }}
      transition={{ duration: 0.2 }} />
    <motion.rect x="2" y="13.2" width="16" height="1.8" rx="0.9" fill="currentColor"
      animate={open ? { rotate: -45, y: -4.1 } : { rotate: 0, y: 0 }}
      style={{ originX: '10px', originY: '14.1px' }}
      transition={{ duration: 0.25, ease: 'easeInOut' }} />
  </svg>
);

export default Navbar;
