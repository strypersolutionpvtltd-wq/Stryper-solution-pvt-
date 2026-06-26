import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import GoogleIcon from './GoogleIcon';
import { useAuth } from '@/context/AuthContext';
import { validateField, filterInput } from '@/utils/validation';
import logoImg from "@/assets/image/logo.png";
import toast from 'react-hot-toast';
import OtpInput from './OtpInput';
import CountdownTimer from './CountdownTimer';
import { Mail, RefreshCw, ArrowLeft } from 'lucide-react';
import { auth } from '@/utils/api';

const SignInForm = ({ onSwitchToSignUp, onClose, hideHeader, setIsVerifyingEmail }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, verifyEmail } = useAuth();
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  // OTP Verification States
  const [showOtp, setShowOtp] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [otpError, setOtpError] = useState(false);
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timerKey, setTimerKey] = useState(0);

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      toast.error('Please enter the complete 6-digit code');
      setOtpError(true);
      return;
    }

    setOtpSubmitting(true);
    setOtpError(false);

    try {
      const res = await verifyEmail(otpEmail, code);
      if (res.success) {
        toast.success('Email verified successfully!');
        if (onClose) onClose();
        
        const role = res.data?.user?.role?.toUpperCase();
        if (role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
        else if (role === 'COMPANY') navigate('/hire-zone/dashboard', { replace: true });
        else navigate('/career-hub/profile', { replace: true });
      } else {
        toast.error(res.message || 'Verification failed. Try again.');
        setOtpError(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed. Try again.');
      setOtpError(true);
    } finally {
      setOtpSubmitting(false);
    }
  };

  const handleOtpResend = async () => {
    setIsResendDisabled(true);
    setOtpError(false);
    try {
      const res = await auth.resendOtp({ email: otpEmail });
      if (res.data?.success) {
        setTimerKey(prev => prev + 1);
        setOtp(new Array(6).fill(''));
        toast.success('Verification code resent to your email');
      }
    } catch (err) {
      setIsResendDisabled(false);
      toast.error(err.response?.data?.message || 'Failed to resend code');
    }
  };

  const handleOtpBack = () => {
    setShowOtp(false);
    if (setIsVerifyingEmail) setIsVerifyingEmail(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const filteredValue = filterInput(name, value);
    setForm(p => ({ ...p, [name]: filteredValue }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    const emailError = validateField('email', form.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validateField('password', form.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors above');
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
        if (result.isNotVerified) {
          const emailToVerify = form.email.toLowerCase().trim();
          setOtpEmail(emailToVerify);
          setShowOtp(true);
          if (setIsVerifyingEmail) setIsVerifyingEmail(true);
          
          auth.resendOtp({ email: emailToVerify })
            .then(() => {
              toast.success('Verification code sent to your email.');
            })
            .catch((err) => {
              console.error('Failed to send verification code:', err);
              toast.error('Failed to send verification code. Please click Resend.');
            });
        } else {
          toast.error(result.message || 'Login failed.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error?.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (showOtp) {
    return (
      <div className={hideHeader ? '' : 'p-8'}>
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-brand-purple-50 rounded-2xl flex items-center justify-center text-brand-purple-600 mb-4 border border-brand-purple-100 shadow-sm shadow-brand-purple-100/50">
            <Mail size={32} />
          </div>
          <h2 className="text-2xl font-bold text-neutral-800 tracking-tight">Verify Your Email</h2>
          <p className="mt-2 text-sm text-neutral-500 max-w-sm">
            We sent a 6-digit verification code to
          </p>
          <div className="flex items-center gap-2 mt-1.5 bg-neutral-50 border border-neutral-100 px-3 py-1 rounded-full">
            <span className="text-xs font-bold text-neutral-700">{otpEmail}</span>
          </div>
        </div>

        <form onSubmit={handleOtpVerify} className="space-y-6">
          <div className="space-y-3">
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest text-center">
              Enter Verification Code
            </label>
            <OtpInput 
              value={otp} 
              onChange={(val) => {
                setOtp(val);
                if (otpError) setOtpError(false);
              }} 
              error={otpError} 
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: otpSubmitting ? 1 : 0.98 }}
            type="submit"
            disabled={otpSubmitting}
            className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: '#8B3A8F' }}
          >
            {otpSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : 'Verify Email'}
          </motion.button>
        </form>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 text-sm">
          <div className="text-neutral-500">
            {isResendDisabled ? (
              <div className="flex items-center gap-1.5">
                <span>Resend code in</span>
                <CountdownTimer 
                  duration={60} 
                  onComplete={() => setIsResendDisabled(false)} 
                  resetKey={timerKey} 
                />
              </div>
            ) : (
              <button
                onClick={handleOtpResend}
                className="flex items-center gap-1.5 text-brand-purple-600 hover:text-brand-purple-700 font-bold transition-colors"
                style={{ color: '#8B3A8F' }}
              >
                <RefreshCw size={14} />
                Resend Code
              </button>
            )}
          </div>

          <button 
            onClick={handleOtpBack}
            className="flex items-center gap-1 text-neutral-400 hover:text-neutral-600 transition-colors mt-2"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className={hideHeader ? '' : 'p-8'}>
      {!hideHeader && (
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 mb-5">
            <img src={logoImg} alt="Stryper Solution" className="h-12 w-12 rounded-full object-cover border border-neutral-100" />
            <span className="font-display font-bold text-base text-neutral-800 tracking-tight uppercase">
              stryper solution
            </span>
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
            className={`w-full px-4 py-2.5 rounded-xl border text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none transition-all ${
              errors.email ? 'border-red-300 bg-red-50' : 'border-neutral-200 focus:border-purple-400'
            }`}
            onFocus={e => {
              if (!errors.email) {
                e.target.style.boxShadow = '0 0 0 2px #8B3A8F40';
              }
            }}
            onBlur={e => e.target.style.boxShadow = ''}
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-xs text-red-500 mt-1 flex items-center gap-1"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                {errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-neutral-600" htmlFor="signin-password">
              Password
            </label>
            <button 
              type="button" 
              onClick={() => {
                if (onClose) onClose();
                navigate('/forgot-password');
              }}
              className="text-xs font-medium hover:underline" 
              style={{ color: '#8B3A8F' }}
            >
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
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none transition-all ${
                errors.password ? 'border-red-300 bg-red-50' : 'border-neutral-200 focus:border-purple-400'
              }`}
              onFocus={e => {
                if (!errors.password) {
                  e.target.style.boxShadow = '0 0 0 2px #8B3A8F40';
                }
              }}
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
          <AnimatePresence>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-xs text-red-500 mt-1 flex items-center gap-1"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                {errors.password}
              </motion.p>
            )}
          </AnimatePresence>
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
