import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { MOCK_CANDIDATE } from '@/career-hub/data/mockCandidate';
import { CAREER_HUB_NAV } from '@/career-hub/utils/careerHubRoutes';

/**
 * Shown in the Navbar when a candidate is logged in.
 * Replaces the "Company Login" button.
 */
const CandidateNavMenu = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const c = MOCK_CANDIDATE;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const initials = c.fullName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors"
        aria-label="Open profile menu"
        aria-expanded={open}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ background: 'linear-gradient(135deg, #8B3A8F, #b05ab5)' }}
        >
          {initials}
        </div>
        <div className="hidden xl:block text-left">
          <p className="text-xs font-semibold text-white leading-tight">{c.fullName}</p>
          <p className="text-[10px] text-white/60 leading-tight">Career Hub</p>
        </div>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          className={`text-white/60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden z-50"
          >
            {/* Profile header */}
            <div className="px-4 py-3 border-b border-neutral-50">
              <p className="text-sm font-semibold text-neutral-800">{c.fullName}</p>
              <p className="text-xs text-neutral-400 truncate">{c.email}</p>
            </div>

            {/* Nav links */}
            <div className="py-1">
              {CAREER_HUB_NAV.slice(0, 4).map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Logout */}
            <div className="border-t border-neutral-50 py-1">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CandidateNavMenu;
