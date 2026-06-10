import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import GoogleIcon from './GoogleIcon';
import { useAuth } from '@/context/AuthContext';
import logoImg from "@/assets/image/logo.jpeg";
import toast from 'react-hot-toast';

const SignInForm = ({ onSwitchToSignUp, onClose, hideHeader }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error('Email and password are required.');
      return;
    }

    setSubmitting(true);
    try {
      let captchaToken = null;
      try {
        if (executeRecaptcha) {
          captchaToken = await executeRecaptcha('login');
        }
      } catch (captchaErr) {
        console.warn('reCAPTCHA token fetch failed, proceeding without it:', captchaErr.message);
      }

      const result = await login(form.email.toLowerCase().trim(), form.password, captchaToken);

      if (result.success) {
        toast.success('Welcome back!');
        if (onClose) onClose();
        const role = result.data.role?.toUpperCase();
        if (role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
        else if (role === 'COMPANY') navigate('/hire-zone/dashboard', { replace: true });
        else navigate('/career-hub/profile', { replace: true });
      } else {
        toast.error(result.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error?.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={hideHeader ? '' : 'p-8'}>
      {/* Header */}
      {!hideHeader && (
        <div className="text-center mb-8">
          <div className="inline-block rounded-xl overflow-hidden bg-black px-4 py-2 mb-5">
            <img src={logoImg} alt="Stryper Solution" className="h-10 w-auto object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-800">Welcome Back</h2>
          <p className="text-neutral-500 text-sm mt-1">Sign in to your Stryper account</p>
        </div>
      )}

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
          whileTap={{ scale: submitting ? 1 : 0.98 }}
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ background: '#8B3A8F' }}
        >
          {submitting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : 'Sign In'}
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
