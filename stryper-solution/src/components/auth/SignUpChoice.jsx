import { motion } from 'framer-motion';

const SignUpChoice = ({ onSelect, onSwitchToSignIn }) => (
  <div className="p-8">
    {/* Header */}
    <div className="text-center mb-8">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: '#f3e8f4' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="#8B3A8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="7" r="4" stroke="#8B3A8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#8B3A8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-neutral-800">Create Account</h2>
      <p className="text-neutral-500 text-sm mt-1">What brings you to Stryper?</p>
    </div>

    {/* Two options */}
    <div className="space-y-4 mb-6">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect('hire-workforce')}
        className="w-full p-5 rounded-xl border-2 border-neutral-200 hover:border-purple-400 text-left transition-all duration-200 group"
      >
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform" style={{ background: '#f3e8f4' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="7" width="20" height="14" rx="2" stroke="#8B3A8F" strokeWidth="2"/>
              <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="#8B3A8F" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 12v4M10 14h4" stroke="#8B3A8F" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-800 text-base">Hire Workforce</h3>
            <p className="text-neutral-500 text-sm mt-0.5">I'm a business looking to hire skilled workers and build my team</p>
          </div>
        </div>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect('find-job')}
        className="w-full p-5 rounded-xl border-2 border-neutral-200 hover:border-purple-400 text-left transition-all duration-200 group"
      >
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform" style={{ background: '#fef3e2' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="#D97706" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
              <path d="M11 8v3l2 2" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-800 text-base">Find a Job</h3>
            <p className="text-neutral-500 text-sm mt-0.5">I'm a job seeker looking for employment opportunities</p>
          </div>
        </div>
      </motion.button>
    </div>

    {/* Sign in link */}
    <p className="text-center text-sm text-neutral-500">
      Already have an account?{' '}
      <button onClick={onSwitchToSignIn} className="font-semibold hover:underline" style={{ color: '#8B3A8F' }}>
        Sign In
      </button>
    </p>
  </div>
);

export default SignUpChoice;
