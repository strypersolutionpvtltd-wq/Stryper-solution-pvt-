import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const TopBar = ({ onMenuToggle }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="h-16 bg-white border-b border-neutral-100 flex items-center justify-between px-5 shrink-0 sticky top-0 z-30">
      {/* Left: hamburger (mobile) + page context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>
        <div className="hidden sm:block">
          <p className="text-xs text-neutral-400 font-medium">Hire Zone</p>
          <p className="text-sm font-semibold text-neutral-800 leading-tight">Company Dashboard</p>
        </div>
      </div>

      {/* Right: search + notifications + profile */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 w-52">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-neutral-400 shrink-0">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-neutral-700 placeholder-neutral-400 outline-none w-full"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" aria-label="3 notifications" />
        </button>

        {/* Profile avatar + dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(p => !p)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-neutral-100 transition-colors"
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: '#8B3A8F' }}>
              C
            </div>
            <span className="hidden sm:block text-sm font-medium text-neutral-700">Company</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-neutral-400">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-neutral-100 py-1 z-50"
              >
                <button
                  onClick={() => { setProfileOpen(false); navigate('/hire-zone/company-profile'); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Company Profile
                </button>
                <button
                  onClick={() => { setProfileOpen(false); navigate('/hire-zone/settings'); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Settings
                </button>
                <div className="border-t border-neutral-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
