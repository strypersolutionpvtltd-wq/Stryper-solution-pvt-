import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { auth } from '@/utils/api';
import OtpInput from '@/components/auth/OtpInput';
import CountdownTimer from '@/components/auth/CountdownTimer';

const VerifyResetOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timerKey, setTimerKey] = useState(0);
  const [error, setError] = useState(false);

  // Email passed from forgot-password page
  const email = location.state?.email || 'user@strypersolution.com';

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      toast.error('Please enter the complete 6-digit code');
      setError(true);
      return;
    }

    setIsLoading(true);
    setError(false);

    try {
      const res = await auth.verifyResetOtp({ email, otp: code });
      setIsLoading(false);
      if (res.data?.success) {
        toast.success('Code verified successfully!');
        navigate('/reset-password', { state: { email, code } });
      }
    } catch (err) {
      setIsLoading(false);
      toast.error(err.response?.data?.message || 'Verification failed. Try again.');
      setError(true);
    }
  };

  const handleResend = async () => {
    setIsResendDisabled(true);
    setError(false);
    try {
      const res = await auth.forgotPassword({ email });
      if (res.data?.success) {
        setTimerKey(prev => prev + 1);
        setOtp(new Array(6).fill(''));
        toast.success(res.data.message || 'Reset code resent successfully!');
      }
    } catch (err) {
      setIsResendDisabled(false);
      toast.error(err.response?.data?.message || 'Failed to resend code');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-purple-50/20 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0"
      >
        <div className="bg-white py-10 px-6 shadow-xl border border-neutral-100 rounded-3xl sm:px-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-brand-purple-50 rounded-2xl flex items-center justify-center text-brand-purple-600 mb-4 border border-brand-purple-100 shadow-sm shadow-brand-purple-100/50">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Verify Reset Code</h2>
            <p className="mt-2 text-sm text-neutral-500 max-w-sm">
              We sent a 6-digit password reset code to
            </p>
            <div className="mt-1.5 bg-neutral-50 border border-neutral-100 px-3 py-1 rounded-full text-xs font-bold text-neutral-700">
              {email}
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest text-center">
                Enter 6-Digit Code
              </label>
              <OtpInput 
                value={otp} 
                onChange={(val) => {
                  setOtp(val);
                  if (error) setError(false);
                }} 
                error={error} 
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-brand-purple-600 hover:bg-brand-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple-500 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify Reset Code'}
            </button>
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
                  onClick={handleResend}
                  className="flex items-center gap-1.5 text-brand-purple-600 hover:text-brand-purple-700 font-bold transition-colors"
                >
                  <RefreshCw size={14} />
                  Resend Code
                </button>
              )}
            </div>

            <button 
              onClick={() => navigate('/forgot-password')}
              className="flex items-center gap-1 text-neutral-400 hover:text-neutral-600 transition-colors mt-2"
            >
              <ArrowLeft size={14} />
              <span>Change Email</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyResetOtp;
