import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import logoImg from "@/assets/image/logo.jpeg";

/**
 * AuthModal — handles Sign In / Sign Up flow
 */
const AuthModal = ({ isOpen, onClose, defaultView = 'signin' }) => {
  const [view, setView] = useState('signin');
  const [signUpType, setSignUpType] = useState('hire-workforce'); // 'find-job' or 'hire-workforce'

  useEffect(() => {
    if (isOpen) {
      if (defaultView === 'signin') {
        setView('signin');
      } else {
        setView('signup');
        setSignUpType(defaultView.includes('find-job') ? 'find-job' : 'hire-workforce');
      }
    }
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

              <div className="p-8 pb-0 flex flex-col items-center">
                {/* Logo on black background — matches brand */}
                <div className="rounded-xl overflow-hidden mb-6 bg-black px-4 py-2">
                  <img src={logoImg} alt="Stryper Solution" className="h-10 w-auto object-contain" />
                </div>
                
                {/* Tabs */}
                <div className="flex w-full border-b border-neutral-100 mb-6">
                  <button
                    onClick={() => setView('signin')}
                    className={`flex-1 pb-3 text-sm font-semibold transition-all border-b-2 ${
                      view === 'signin' ? 'border-brand-purple-600 text-brand-purple-600' : 'border-transparent text-neutral-400'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setView('signup')}
                    className={`flex-1 pb-3 text-sm font-semibold transition-all border-b-2 ${
                      view === 'signup' ? 'border-brand-purple-600 text-brand-purple-600' : 'border-transparent text-neutral-400'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {view === 'signin' ? (
                  <SlideView key="signin">
                    <div className="px-8 pb-8">
                      <SignInForm
                        onSwitchToSignUp={() => setView('signup')}
                        onClose={onClose}
                        hideHeader
                      />
                    </div>
                  </SlideView>
                ) : (
                  <SlideView key={signUpType}>
                    <div className="px-8 pb-8">
                      {/* Role selector */}
                      <div className="flex bg-neutral-100 p-1 rounded-xl mb-5">
                        <button
                          onClick={() => setSignUpType('hire-workforce')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${signUpType === 'hire-workforce' ? 'bg-white shadow text-brand-purple-600' : 'text-neutral-500'}`}
                        >
                          Employer
                        </button>
                        <button
                          onClick={() => setSignUpType('find-job')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${signUpType === 'find-job' ? 'bg-white shadow text-brand-purple-600' : 'text-neutral-500'}`}
                        >
                          Candidate
                        </button>
                      </div>
                      <SignUpForm
                        type={signUpType}
                        onBack={() => setView('signin')}
                        onSwitchToSignIn={() => setView('signin')}
                        onClose={onClose}
                        hideHeader
                      />
                    </div>
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
