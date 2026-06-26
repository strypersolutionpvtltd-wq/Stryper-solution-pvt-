import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import GoogleIcon from './GoogleIcon';
import { useAuth } from '@/context/AuthContext';
import { auth, companyProfile, candidateProfile, upload } from '@/utils/api';
import { validateField, filterInput } from '@/utils/validation';
import toast from 'react-hot-toast';
import OtpInput from './OtpInput';
import CountdownTimer from './CountdownTimer';
import { Mail, RefreshCw, Edit2, ArrowLeft } from 'lucide-react';

const HIRE_FIELDS = [
  { name: 'companyName', label: 'Company Name', type: 'text', placeholder: 'e.g. Acme Services Pvt. Ltd.' },
  { name: 'industry',    label: 'Industry Type', type: 'text', placeholder: 'e.g. Manufacturing, IT, Logistics' },
  { name: 'fullName',    label: 'Contact Person Name', type: 'text', placeholder: 'e.g. Rahul Sharma' },
  { name: 'email',       label: 'Official Work Email', type: 'email', placeholder: 'rahul@company.com' },
  { name: 'phone',       label: 'Contact Number', type: 'tel', placeholder: '+91 98765 43210' },
  { name: 'website',     label: 'Company Website (Optional)', type: 'text', placeholder: 'www.company.com' },
  { name: 'password',    label: 'Set Password', type: 'password', placeholder: '••••••••' },
];

const JOB_FIELDS = [
  { name: 'fullName',   label: 'Full Name', type: 'text', placeholder: 'Rahul Sharma' },
  { name: 'email',      label: 'Email Address', type: 'email', placeholder: 'rahul@gmail.com' },
  { name: 'phone',      label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210' },
  { name: 'city',       label: 'City', type: 'text', placeholder: 'Delhi' },
  { name: 'experience', label: 'Years of Experience', type: 'text', placeholder: '2 years' },
  { name: 'password',   label: 'Password', type: 'password', placeholder: '••••••••' },
];

const SignUpForm = ({ type, onBack, onSwitchToSignIn, onClose, hideHeader, setIsVerifyingEmail }) => {
  const isHire = type === 'hire-workforce';
  const fields = isHire ? HIRE_FIELDS : JOB_FIELDS;
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { sendSignupOtp, registerVerified } = useAuth();
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  // OTP Verification States
  const [showOtp, setShowOtp] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [signupToken, setSignupToken] = useState('');
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
      const res = await registerVerified(signupToken, code);
      if (res.success) {
        if (isHire) {
          try {
            await companyProfile.create({
              companyName: form.companyName || 'My Company',
              industry: form.industry || 'General',
              companySize: '1-10',
              companyDescription: `${form.companyName || 'Company'} profile`,
              hrName: form.fullName || '',
              email: form.email || '',
              phone: form.phone || '',
              website: form.website || '',
            });
          } catch (profileErr) {
            console.warn('Company profile creation failed:', profileErr?.response?.data?.message);
          }
        } else {
          try {
            const nameParts = (form.fullName || '').trim().split(' ');
            const firstName = nameParts[0] || 'User';
            const lastName = nameParts.slice(1).join(' ') || 'Name';
            await candidateProfile.create({
              firstName,
              lastName,
              phone: form.phone || '',
              location: form.city || '',
            });
          } catch (profileErr) {
            console.warn('Candidate profile creation failed:', profileErr?.response?.data?.message);
          }

          if (file) {
            try {
              const formData = new FormData();
              formData.append('resume', file);
              await upload.uploadResume(formData);
            } catch (uploadErr) {
              console.warn('Resume upload failed:', uploadErr?.response?.data?.message);
            }
          }
        }

        toast.success('Account created and verified successfully!');
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
      const role = isHire ? 'COMPANY' : 'CANDIDATE';
      let captchaToken = null;
      try {
        if (executeRecaptcha) {
          captchaToken = await executeRecaptcha('register');
        }
      } catch (captchaErr) {
        console.warn('reCAPTCHA token fetch failed, proceeding without it:', captchaErr.message);
      }

      const res = await sendSignupOtp(
        form.email.toLowerCase().trim(),
        form.password,
        role,
        captchaToken
      );

      if (res.success) {
        setSignupToken(res.data.signupToken);
        setTimerKey(prev => prev + 1);
        setOtp(new Array(6).fill(''));
        toast.success('Verification code resent to your email');
      } else {
        setIsResendDisabled(false);
        toast.error(res.message || 'Failed to resend code');
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
    // Clear error on field change
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0] || null;
    setFile(file);
    if (file) setFileError('');
  };

  const handleFileDropped = (droppedFile) => {
    setFile(droppedFile);
    if (droppedFile) setFileError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate all fields
    fields.forEach(({ name }) => {
      const error = validateField(name, form[name] || '');
      if (error) newErrors[name] = error;
    });

    // Validate resume for candidates
    if (!isHire) {
      if (!file) {
        newErrors.resume = 'Please upload your resume';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors above');
      return;
    }

    setLoading(true);
    try {
      let captchaToken = null;
      try {
        if (executeRecaptcha) {
          captchaToken = await executeRecaptcha('register');
        }
      } catch (captchaErr) {
        console.warn('reCAPTCHA token fetch failed, proceeding without it:', captchaErr.message);
      }

      const role = isHire ? 'COMPANY' : 'CANDIDATE';
      const result = await sendSignupOtp(
        form.email.toLowerCase().trim(),
        form.password,
        role,
        captchaToken
      );

      if (!result.success) {
        toast.error(result.message || 'Registration failed.');
        return;
      }

      setSignupToken(result.data.signupToken);
      setOtpEmail(form.email.toLowerCase().trim());
      setShowOtp(true);
      if (setIsVerifyingEmail) setIsVerifyingEmail(true);
      toast.success('Verification code sent to your email.');

    } catch (error) {
      console.error('SignUp error:', error);
      toast.error(error?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
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
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            aria-label="Go back"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div>
            <h2 className="text-xl font-bold text-neutral-800">
              {isHire ? 'Hire Workforce' : 'Find a Job'}
            </h2>
            <p className="text-neutral-500 text-xs mt-0.5">
              {isHire ? 'Create your employer account' : 'Create your job seeker account'}
            </p>
          </div>
        </div>
      )}

      {/* Google Sign Up */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={() => toast('Google signup coming soon!', { icon: '🔜' })}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all text-sm font-medium text-neutral-700 mb-5"
      >
        <GoogleIcon />
        Continue with Google
      </motion.button>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-neutral-200" />
        <span className="text-xs text-neutral-400 font-medium">or fill in details</span>
        <div className="flex-1 h-px bg-neutral-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {fields.map(({ name, label, type: fType, placeholder }) => (
          <div key={name}>
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5" htmlFor={`signup-${name}`}>
              {label}
            </label>
            <div className="relative">
              <input
                id={`signup-${name}`}
                name={name}
                type={fType === 'password' ? (showPass ? 'text' : 'password') : fType}
                placeholder={placeholder}
                value={form[name] || ''}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none transition-all ${
                  errors[name] ? 'border-red-300 bg-red-50' : 'border-neutral-200 focus:border-purple-400'
                }`}
                onFocus={e => {
                  if (!errors[name]) {
                    e.target.style.boxShadow = '0 0 0 2px #8B3A8F40';
                  }
                }}
                onBlur={e => e.target.style.boxShadow = ''}
              />
              {fType === 'password' && (
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
              )}
            </div>
            <AnimatePresence>
              {errors[name] && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-xs text-red-500 mt-1 flex items-center gap-1"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                  {errors[name]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}

        {!isHire && (
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
              Upload Resume / CV
            </label>
            <label
              htmlFor="signup-resume"
              className={`flex flex-col items-center justify-center w-full py-6 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                dragOver ? 'border-brand-purple-500 bg-brand-purple-50' : 
                fileError ? 'border-red-300 bg-red-50' :
                'border-neutral-200 hover:border-brand-purple-400 hover:bg-neutral-50'
              }`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { 
                e.preventDefault(); 
                setDragOver(false); 
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile) {
                  handleFileDropped(droppedFile);
                }
              }}
            >
              <input id="signup-resume" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFile} />
              {file ? (
                <div className="flex items-center gap-2 text-xs font-medium text-brand-purple-600">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5 5h6M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                  {file.name}
                </div>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mb-1 text-neutral-400"><path d="M12 16V4M8 8l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  <p className="text-xs text-neutral-500">Drop resume or <span className="text-brand-purple-600 font-semibold">browse</span></p>
                </>
              )}
            </label>
            <AnimatePresence>
              {fileError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-xs text-red-500 mt-1 flex items-center gap-1"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                  {fileError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}

        <motion.button
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ background: '#8B3A8F' }}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            isHire ? 'Create Employer Account' : 'Create Candidate Account'
          )}
        </motion.button>
      </form>

      <p className="text-center text-sm text-neutral-500 mt-5">
        Already have an account?{' '}
        <button onClick={onSwitchToSignIn} className="font-semibold hover:underline" style={{ color: '#8B3A8F' }}>
          Sign In
        </button>
      </p>
    </div>
  );
};

export default SignUpForm;
