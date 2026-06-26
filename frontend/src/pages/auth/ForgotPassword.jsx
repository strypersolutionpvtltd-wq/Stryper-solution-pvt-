import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { auth } from '@/utils/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email address is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const res = await auth.forgotPassword({ email });
      setIsLoading(false);
      if (res.data?.success) {
        toast.success(res.data.message || 'Verification code sent to your email!');
        navigate('/verify-reset-otp', { state: { email } });
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'Failed to send reset code');
      toast.error(err.response?.data?.message || 'Failed to send reset code');
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
              <Shield size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Forgot Password</h2>
            <p className="mt-2 text-sm text-neutral-500 max-w-sm">
              Enter your email address and we'll send you a 6-digit code to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 ml-1 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative group">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 z-10 ${error ? 'text-red-400' : 'text-neutral-400 group-focus-within:text-brand-purple-500'}`}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="name@company.com"
                  className={`w-full pl-12 pr-4 py-3.5 bg-neutral-50 border-2 rounded-xl text-sm transition-all duration-200 outline-none
                    ${error ? 'border-red-200 focus:border-red-500 bg-red-50/50' : 'border-neutral-100 focus:border-brand-purple-500 focus:bg-white focus:shadow-sm'}
                  `}
                />
              </div>
              {error && (
                <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-brand-purple-600 hover:bg-brand-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple-500 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>

          <div className="mt-6 flex justify-center text-sm">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-neutral-500 hover:text-brand-purple-600 font-semibold transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Login</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
