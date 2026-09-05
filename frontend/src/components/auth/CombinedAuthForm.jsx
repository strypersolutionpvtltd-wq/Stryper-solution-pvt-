import React, { useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  Briefcase, 
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import logoImg from "@/assets/image/logo.png";
import toast from 'react-hot-toast';

// --- Zod Validation Schemas ---

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['candidate', 'employer'], {
    errorMap: () => ({ message: 'Please select your role' })
  })
});

// --- UI Components ---

const InputField = ({ 
  label, 
  icon: Icon, 
  type = 'text', 
  error, 
  register, 
  name, 
  showPasswordToggle,
  onTogglePassword,
  isPasswordVisible,
  placeholder
}) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-neutral-700 ml-1 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative group">
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 z-10 ${error ? 'text-red-400' : 'text-neutral-400 group-focus-within:text-brand-purple-500'}`}>
          <Icon size={18} />
        </div>
        
        <input
          {...register(name)}
          type={showPasswordToggle ? (isPasswordVisible ? 'text' : 'password') : type}
          className={`w-full pl-12 pr-11 py-3 bg-neutral-50 border-2 rounded-xl text-sm transition-all duration-200 outline-none
            ${error ? 'border-red-200 focus:border-red-500 bg-red-50/50' : 'border-neutral-100 focus:border-brand-purple-500 focus:bg-white focus:shadow-sm'}
          `}
          placeholder={placeholder}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-brand-purple-600 transition-colors z-10"
          >
            {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-[11px] font-bold text-red-500 ml-1 mt-1"
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

const CombinedAuthForm = ({ onClose, initialView = 'signin', initialRole = 'candidate' }) => {
  const [activeTab, setActiveTab] = useState(() => {
    if (initialRole === 'employer' || initialRole === 'company' || initialRole === 'hire-workforce') return 'employer';
    return 'candidate';
  }); 
  const [isLogin, setIsLogin] = useState(initialView !== 'signup');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);
  
  const { setIsLoggedIn, setUserRole, setUserData, register } = useAuth();
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegister
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: activeTab === 'employer' ? 'employer' : 'candidate' }
  });

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Password reset link sent to your email!');
      setIsForgotPassword(false);
    }, 1500);
  };

  const onLogin = async (data) => {
    setIsLoading(true);
    setTimeout(() => {
      const role = activeTab;
      setUserData({ 
        fullName: role === 'candidate' ? 'John Candidate' : 'Jane Employer', 
        email: data.email,
        title: role === 'candidate' ? 'Job Seeker' : 'Hiring Manager'
      });
      setUserRole(role);
      setIsLoggedIn(true);
      setIsLoading(false);
      toast.success('Successfully logged in!');
      if (onClose) onClose();
      navigate(role === 'candidate' ? '/career-hub/profile' : '/hire-zone/dashboard');
    }, 1500);
  };

  const onRegister = async (data) => {
    setIsLoading(true);
    
    try {
      let token = null;
      if (executeRecaptcha) {
        token = await executeRecaptcha('register');
      }

      const roleMap = { candidate: 'CANDIDATE', employer: 'COMPANY' };
      const result = await register(
        data.email.toLowerCase().trim(), 
        data.password, 
        roleMap[data.role], 
        token
      );

      if (result.success) {
        toast.success('Account created successfully!');
        setUserData({ 
          fullName: data.fullName, 
          email: data.email,
          title: data.role === 'candidate' ? 'Job Seeker' : 'Hiring Manager'
        });
        setUserRole(data.role);
        setIsLoggedIn(true);
        if (onClose) onClose();
        navigate('/verify-email', { 
          state: { 
            email: data.email, 
            phone: data.phone,
            nextRedirect: data.role === 'candidate' ? '/career-hub/profile' : '/hire-zone/dashboard'
          }, 
          replace: true 
        });
      } else {
        toast.error(result.message || 'Registration failed.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetLogin();
    resetRegister();
    setShowPassword(false);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 flex flex-col">
      <div className="bg-black py-4 flex items-center justify-center gap-2.5 border-b border-white/10">
        <img src={logoImg} alt="Stryper Solution" className="h-10 w-10 rounded-full object-cover border border-white/10" />
        <span className="font-display font-bold text-base text-white tracking-tight uppercase">
          stryper solution
        </span>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex border-b border-neutral-100">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${
            isLogin ? 'border-brand-purple-600 text-brand-purple-600' : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${
            !isLogin ? 'border-brand-purple-600 text-brand-purple-600' : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Create Account
        </button>
      </div>

      <div className="p-8">
        {/* Role Switcher (Only if in Login mode) */}
        {isLogin && (
          <div className="flex bg-neutral-100 p-1 rounded-xl mb-6 relative">
            <motion.div
              layoutId="activeRoleTab"
              className="absolute bg-white shadow-sm rounded-lg"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              style={{
                width: 'calc(50% - 4px)',
                height: 'calc(100% - 8px)',
                left: activeTab === 'candidate' ? '4px' : 'calc(50% + 0px)',
                top: '4px'
              }}
            />
            <button
              onClick={() => setActiveTab('candidate')}
              className={`relative z-10 flex-1 py-2 text-xs font-bold transition-colors ${
                activeTab === 'candidate' ? 'text-brand-purple-600' : 'text-neutral-500'
              }`}
            >
              Candidate
            </button>
            <button
              onClick={() => setActiveTab('employer')}
              className={`relative z-10 flex-1 py-2 text-xs font-bold transition-colors ${
                activeTab === 'employer' ? 'text-brand-purple-600' : 'text-neutral-500'
              }`}
            >
              Employer
            </button>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold text-neutral-800">
            {isForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Join Stryper')}
          </h2>
          <p className="text-neutral-500 text-sm mt-1">
            {isForgotPassword 
              ? 'Enter your email to receive a reset link'
              : (isLogin 
                  ? `Sign in to your ${activeTab} account` 
                  : 'Fill in the details to create your account')}
          </p>
        </div>

        <form 
          onSubmit={isForgotPassword ? handleForgotPasswordSubmit : (isLogin ? handleLoginSubmit(onLogin) : handleRegisterSubmit(onRegister))} 
          className="space-y-4"
        >
          <AnimatePresence mode="wait">
            {isForgotPassword ? (
              <motion.div
                key="forgot-password"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <InputField
                  label="Email Address"
                  icon={Mail}
                  name="email"
                  placeholder="name@example.com"
                  register={loginRegister}
                  error={loginErrors.email}
                />
                <button 
                  type="button" 
                  onClick={() => setIsForgotPassword(false)}
                  className="text-xs font-bold text-neutral-500 hover:text-neutral-800 mt-2 block"
                >
                  Back to Sign In
                </button>
              </motion.div>
            ) : isLogin ? (
              <motion.div
                key="login-fields"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <InputField
                  label="Email Address"
                  icon={Mail}
                  name="email"
                  placeholder="name@example.com"
                  register={loginRegister}
                  error={loginErrors.email}
                />
                <InputField
                  label="Password"
                  icon={Lock}
                  name="password"
                  placeholder="••••••••"
                  register={loginRegister}
                  error={loginErrors.password}
                  showPasswordToggle
                  isPasswordVisible={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />
                <button 
                  type="button" 
                  onClick={() => setIsForgotPassword(true)}
                  className="text-xs font-bold text-brand-purple-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="register-fields"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <InputField
                  label="Full Name"
                  icon={User}
                  name="fullName"
                  placeholder="Rahul Sharma"
                  register={registerRegister}
                  error={registerErrors.fullName}
                />
                <InputField
                  label="Email Address"
                  icon={Mail}
                  name="email"
                  placeholder="rahul@example.com"
                  register={registerRegister}
                  error={registerErrors.email}
                />
                <InputField
                  label="Phone Number"
                  icon={Phone}
                  name="phone"
                  placeholder="9876543210"
                  register={registerRegister}
                  error={registerErrors.phone}
                />
                
                {/* Role Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700 ml-1 uppercase tracking-wider">
                    I am a
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand-purple-500 transition-colors z-10 pointer-events-none">
                      <Briefcase size={18} />
                    </div>
                    <select
                      {...registerRegister('role')}
                      className={`w-full pl-12 pr-10 py-3 bg-neutral-50 border-2 rounded-xl text-sm appearance-none transition-all outline-none
                        ${registerErrors.role ? 'border-red-200 focus:border-red-500' : 'border-neutral-100 focus:border-brand-purple-500'}
                      `}
                    >
                      <option value="candidate">Candidate (Looking for Job)</option>
                      <option value="employer">Employer (Looking to Hire)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>

                <InputField
                  label="Password"
                  icon={Lock}
                  name="password"
                  placeholder="••••••••"
                  register={registerRegister}
                  error={registerErrors.password}
                  showPasswordToggle
                  isPasswordVisible={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-purple-600 hover:bg-brand-purple-700 disabled:bg-neutral-300 text-white rounded-xl font-bold text-sm transition-all mt-6 shadow-lg shadow-brand-purple-500/20"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Create Account')}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CombinedAuthForm;
