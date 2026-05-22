import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignInForm from './SignInForm';
import SignUpChoice from './SignUpChoice';
import SignUpForm from './SignUpForm';

/**
 * AuthModal — handles Sign In / Sign Up flow
 * view: 'signin' | 'signup-choice' | 'signup-hire-workforce' | 'signup-find-job'
 */
const AuthModal = ({ isOpen, onClose, defaultView = 'signin' }) => {
  const [view, setView] = useState(defaultView);

  useEffect(() => {
    if (isOpen) setView(defaultView);
  }, [isOpen, defaultView]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors z-10"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>

              <AnimatePresence mode="wait">
                {view === 'signin' && (
                  <SlideView key="signin">
                    <SignInForm
                      onSwitchToSignUp={() => setView('signup-choice')}
                      onClose={onClose}
                    />
                  </SlideView>
                )}
                {view === 'signup-choice' && (
                  <SlideView key="signup-choice">
                    <SignUpChoice
                      onSelect={(type) => setView(`signup-${type}`)}
                      onSwitchToSignIn={() => setView('signin')}
                    />
                  </SlideView>
                )}
                {(view === 'signup-hire-workforce' || view === 'signup-find-job') && (
                  <SlideView key={view}>
                    <SignUpForm
                      type={view === 'signup-hire-workforce' ? 'hire-workforce' : 'find-job'}
                      onBack={() => setView('signup-choice')}
                      onSwitchToSignIn={() => setView('signin')}
                      onClose={onClose}
                    />
                  </SlideView>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SlideView = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export default AuthModal;
