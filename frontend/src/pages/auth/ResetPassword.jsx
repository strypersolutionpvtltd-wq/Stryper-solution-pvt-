import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Key, Eye, EyeOff, Lock, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { auth } from '@/utils/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const email = location.state?.email;
  const otp = location.state?.code;

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = calculateStrength(password);
  
  const getStrengthTextAndColor = (score) => {
    if (!password) return { text: '', color: 'bg-neutral-100', width: 'w-0' };
    switch (score) {
      case 1:
        return { text: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
      case 2:
        return { text: 'Fair', color: 'bg-orange-500', width: 'w-2/4' };
      case 3:
        return { text: 'Good', color: 'bg-amber-500', width: 'w-3/4' };
      case 4:
        return { text: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
      default:
        return { text: 'Very Weak', color: 'bg-red-500', width: 'w-[10%]' };
    }
  };

  const strengthMeta = getStrengthTextAndColor(strength);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!email || !otp) {
      toast.error('Session expired. Please request a new password reset code.');
      navigate('/forgot-password');
      return;
    }

    setIsLoading(true);

    try {
      const res = await auth.resetPassword({ email, otp, password });
      setIsLoading(false);
      if (res.data?.success) {
        toast.success(res.data.message || 'Password reset successful! Please sign in with your new password.');
        navigate('/'); // Redirect to home/login
      }
    } catch (err) {
      setIsLoading(false);
      toast.error(err.response?.data?.message || 'Password reset failed. Try again.');
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
              <Key size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Reset Password</h2>
            <p className="mt-2 text-sm text-neutral-500 max-w-sm">
              Please choose a new secure password for your Stryper Solution account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 ml-1 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand-purple-500 transition-colors z-10">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-11 py-3.5 bg-neutral-50 border-2 border-neutral-100 focus:border-brand-purple-500 focus:bg-white focus:shadow-sm rounded-xl text-sm transition-all duration-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-brand-purple-600 transition-colors z-10"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-1.5 px-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-neutral-500">Password Strength:</span>
                  <span className={`
                    ${strength === 1 && 'text-red-500'}
                    ${strength === 2 && 'text-orange-500'}
                    ${strength === 3 && 'text-amber-500'}
                    ${strength === 4 && 'text-emerald-500'}
                  `}>
                    {strengthMeta.text}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${strengthMeta.color} ${strengthMeta.width}`} />
                </div>

                {/* Password Requirements Checklist */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1.5 text-[11px] text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    {password.length >= 8 ? <Check size={12} className="text-emerald-500" /> : <X size={12} className="text-neutral-300" />}
                    <span>At least 8 chars</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {/[a-z]/.test(password) && /[A-Z]/.test(password) ? <Check size={12} className="text-emerald-500" /> : <X size={12} className="text-neutral-300" />}
                    <span>A-Z & a-z letters</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {/\d/.test(password) ? <Check size={12} className="text-emerald-500" /> : <X size={12} className="text-neutral-300" />}
                    <span>At least 1 digit</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {/[^A-Za-z0-9]/.test(password) ? <Check size={12} className="text-emerald-500" /> : <X size={12} className="text-neutral-300" />}
                    <span>Special character</span>
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 ml-1 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand-purple-500 transition-colors z-10">
                  <Lock size={18} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-11 py-3.5 bg-neutral-50 border-2 border-neutral-100 focus:border-brand-purple-500 focus:bg-white focus:shadow-sm rounded-xl text-sm transition-all duration-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-brand-purple-600 transition-colors z-10"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-brand-purple-600 hover:bg-brand-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple-500 transition-all duration-200 disabled:opacity-50 pt-3"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
