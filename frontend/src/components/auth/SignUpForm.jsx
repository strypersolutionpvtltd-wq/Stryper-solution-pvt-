import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import GoogleIcon from './GoogleIcon';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

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

const SignUpForm = ({ type, onBack, onSwitchToSignIn, onClose, hideHeader }) => {
  const isHire = type === 'hire-workforce';
  const fields = isHire ? HIRE_FIELDS : JOB_FIELDS;
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const { setIsLoggedIn, setUserRole, setUserData } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleFile = (e) => setFile(e.target.files[0] || null);

  const onCaptchaChange = (value) => {
    if (value) setCaptchaVerified(true);
  };

  const handleGoogleSignup = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Connecting to Google Securely...',
        success: 'Successfully registered with Google!',
        error: 'Google Registration failed.',
      }
    ).then(() => {
      const role = isHire ? 'company' : 'candidate';
      setUserData({ 
        fullName: 'Google User', 
        email: 'user@gmail.com', 
        title: role === 'company' ? 'Hiring Manager' : 'Job Seeker' 
      });
      setUserRole(role);
      setIsLoggedIn(true);
      if (onClose) onClose();
      navigate(role === 'company' ? '/hire-zone/dashboard' : '/career-hub/profile', { replace: true });
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!captchaVerified) {
      alert("Security Check Required: Please verify that you are not a robot.");
      return;
    }

    if (!isHire && !file) {
      toast.error("Please upload your resume to continue.");
      return;
    }

    // Password strength/security check
    if (form.password && form.password.length < 6) {
      alert("Security Requirement: Password must be at least 6 characters long.");
      return;
    }

    const role = isHire ? 'company' : 'candidate';
    const email = form.email ? form.email.toLowerCase().trim() : '';
    const name = form.fullName || (role === 'company' ? 'Company Manager' : 'Candidate User');

    setUserData({ 
      fullName: name, 
      email: email, 
      title: role === 'company' ? 'Hiring Manager' : 'Job Seeker' 
    });
    setUserRole(role);
    setIsLoggedIn(true);
    
    toast.success('Registration successful!');
    if (onClose) onClose();
    navigate(role === 'company' ? '/hire-zone/dashboard' : '/career-hub/profile', { replace: true });
  };

  return (
    <div className={hideHeader ? '' : 'p-8'}>
      {/* Back + Header */}
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
        onClick={handleGoogleSignup}
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
        <span className="text-xs text-neutral-400 font-medium">or fill in details</span>
        <div className="flex-1 h-px bg-neutral-200" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
                required
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{ '--tw-ring-color': '#8B3A8F' }}
                onFocus={e => e.target.style.boxShadow = '0 0 0 2px #8B3A8F40'}
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
          </div>
        ))}

        {!isHire && (
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
              Upload Resume / CV
            </label>
            <label 
              htmlFor="signup-resume" 
              className={`flex flex-col items-center justify-center w-full py-6 rounded-xl border-2 border-dashed cursor-pointer transition-all ${dragOver ? 'border-brand-purple-500 bg-brand-purple-50' : 'border-neutral-200 hover:border-brand-purple-400 hover:bg-neutral-50'}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); setFile(e.dataTransfer.files[0] || null); }}
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
          </div>
        )}

        {/* Google ReCAPTCHA */}
        <div className="flex justify-center py-2">
          <ReCAPTCHA
            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Test site key
            onChange={onCaptchaChange}
            theme="light"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-colors mt-2"
          style={{ background: '#8B3A8F' }}
        >
          {isHire ? 'Create Employer Account' : 'Create Candidate Account'}
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
