import { useState } from 'react';
import { motion } from 'framer-motion';
import GoogleIcon from './GoogleIcon';

const SignInForm = ({ onSwitchToSignUp, onClose }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to backend
    console.log('SignIn submit:', form);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: '#f3e8f4' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#8B3A8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="#8B3A8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-neutral-800">Welcome Back</h2>
        <p className="text-neutral-500 text-sm mt-1">Sign in to your Stryper account</p>
      </div>

      {/* Google Sign In */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all text-sm font-medium text-neutral-700 mb-5"
      >
        <GoogleIcon />
        Continue with Google
      </motion.button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-neutral-200" />
        <span className="text-xs text-neutral-400 font-medium">or sign in with email</span>
        <div className="flex-1 h-px bg-neutral-200" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1.5" htmlFor="signin-email">
            Email Address
          </label>
          <input
            id="signin-email"
            name="email"
            type="email"
            placeholder="rahul@gmail.com"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none transition-all"
            onFocus={e => e.target.style.boxShadow = '0 0 0 2px #8B3A8F40'}
            onBlur={e => e.target.style.boxShadow = ''}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-neutral-600" htmlFor="signin-password">
              Password
            </label>
            <button type="button" className="text-xs font-medium hover:underline" style={{ color: '#8B3A8F' }}>
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="signin-password"
              name="password"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none transition-all"
              onFocus={e => e.target.style.boxShadow = '0 0 0 2px #8B3A8F40'}
              onBlur={e => e.target.style.boxShadow = ''}
            />
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              aria-label={showPass ? 'Hide password' : 'Show password'}
            >
              {showPass ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
              )}
            </button>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-colors mt-2"
          style={{ background: '#8B3A8F' }}
        >
          Sign In
        </motion.button>
      </form>

      <p className="text-center text-sm text-neutral-500 mt-5">
        Don't have an account?{' '}
        <button onClick={onSwitchToSignUp} className="font-semibold hover:underline" style={{ color: '#8B3A8F' }}>
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default SignInForm;
