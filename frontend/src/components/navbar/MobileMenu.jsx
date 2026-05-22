import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NAVBAR_ROUTES } from '@/routes/routeConfig';
import Logo from '@/components/shared/Logo';

const drawerVariants = {
  hidden:  { opacity: 0, x: '100%' },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0, x: '100%',
    transition: { duration: 0.24, ease: [0.55, 0, 1, 0.45] },
  },
};

const itemVariants = {
  hidden:   { opacity: 0, x: 18 },
  visible:  (i) => ({
    opacity: 1, x: 0,
    transition: { delay: 0.08 + i * 0.055, duration: 0.32, ease: 'easeOut' },
  }),
};

const MobileMenu = ({ id, onClose, onSignIn, onSignUp }) => (
  <>
    {/* Backdrop */}
    <motion.div
      className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      aria-hidden="true"
    />

    {/* Drawer panel */}
    <motion.div
      id={id}
      key="mobile-menu"
      variants={drawerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed top-0 right-0 bottom-0 z-50 w-[300px] bg-white flex flex-col shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 h-[72px] border-b border-neutral-100 shrink-0">
        <Logo scrolled />
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-500
                     hover:bg-neutral-100 hover:text-neutral-800 transition-colors duration-200"
          aria-label="Close navigation"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-0.5" aria-label="Mobile navigation">
        {NAVBAR_ROUTES.map(({ label, path }, i) => (
          <motion.div
            key={path}
            custom={i}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <NavLink
              to={path}
              end={path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  'flex items-center justify-between px-4 py-3.5 rounded-xl',
                  'text-[15px] font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-brand-purple-50 text-brand-purple-700'
                    : 'text-neutral-700 hover:bg-neutral-50 hover:text-brand-purple-600',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <span>{label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-purple-500" aria-hidden="true" />
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Bottom CTA */}
      <motion.div
        className="px-5 py-6 border-t border-neutral-100 space-y-3 shrink-0"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
      >
        <div className="flex gap-2">
          <button
            onClick={() => { onClose(); onSignIn(); }}
            className="flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-colors duration-200"
            style={{ borderColor: '#8B3A8F', color: '#8B3A8F' }}
          >
            Sign In
          </button>
          <button
            onClick={() => { onClose(); onSignUp(); }}
            className="flex-1 py-3 rounded-xl text-white text-sm font-semibold transition-colors duration-200"
            style={{ background: '#8B3A8F' }}
          >
            Sign Up
          </button>
        </div>
        <button
          onClick={() => { onClose(); onSignIn(); }}
          className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl text-white text-sm font-semibold transition-colors duration-200"
          style={{ background: '#8B3A8F' }}
        >
          Company Login
        </button>
      </motion.div>
    </motion.div>
  </>
);

export default MobileMenu;
