import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHero from '@/components/shared/PageHero';
import img4 from '@/assets/image/4.jpeg';
import { fadeInUp, staggerContainer, viewportOnce } from '@/utils/animations';
import api, { jobs as jobsApi, upload } from '@/utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/auth/AuthModal';

const P = '#8B3A8F';
const G = '#F5A623';

const STRATEGY = [
  { title: 'Career Advancement', desc: 'We map out your career path with our partner industries for long-term growth.', icon: '🚀' },
  { title: 'Deployment & Support', desc: 'From document verification to site onboarding, we handle the heavy lifting.', icon: '🤝' },
  { title: 'Skill Development', desc: 'Regular training sessions to keep you relevant in the changing job market.', icon: '📚' }
];

const STEPS = [
  { s: 1, t: 'Registration', d: 'Upload your details to our candidate pool.' },
  { s: 2, t: 'Skill Assessment', d: 'Our experts evaluate your profile and skills.' },
  { s: 3, t: 'Match-Making', d: 'We find the perfect client company for your role.' },
  { s: 4, t: 'Deployment', d: 'Get placed with full legal and salary support.' },
];

/* ── Apply Modal ── */
const ApplyModal = ({ job, onClose, onApplied }) => {
  const [form, setForm] = useState({ resume: null, expectedSalary: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0] || null;
    if (file) setForm(p => ({ ...p, resume: file }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0] || null;
    if (file) setForm(p => ({ ...p, resume: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.resume) {
      toast.error('Please upload your resume');
      return;
    }
    setSubmitting(true);
    try {
      // 1. Upload resume to Cloudinary
      const fd = new FormData();
      fd.append('resume', form.resume);
      const upRes = await upload.uploadResume(fd);
      const resumeUrl = upRes.data?.url || upRes.data?.resume || '';

      // 2. Submit application
      const matches = form.expectedSalary ? form.expectedSalary.match(/\d+/g) : null;
      let salaryExpectation = null;
      if (matches) {
        const nums = matches.map(Number);
        let lpa = 0;
        if (nums.length === 2) {
          lpa = (nums[0] + nums[1]) / 2;
        } else if (nums.length === 1) {
          lpa = form.expectedSalary.toLowerCase().includes('below') ? nums[0] - 0.5 : nums[0];
        }
        salaryExpectation = lpa * 100000;
      }

      await api.post('/applications', {
        jobId: job._id || job.id,
        resume: resumeUrl,
        salaryExpectation,
      });

      onApplied?.(job._id || job.id);
      setDone(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application';
      if (err.response?.status === 404) {
        toast.error('Please complete your Career Hub profile before applying.', { duration: 5000 });
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden z-10 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 font-display">Apply for Position</h3>
            <p className="text-sm text-neutral-500 mt-0.5">{job.title} · Stryper Solution</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100 transition-colors shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {done ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-14 px-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#faf5fb' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M5 14l6 6 12-12" stroke="#8B3A8F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 font-display mb-2">Application Submitted!</h3>
              <p className="text-sm text-neutral-500">We've also updated your Career Hub profile with your resume details.</p>
              <button onClick={onClose} className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: P }}>Close</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {/* 1. Resume Upload */}
              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-1.5">
                  Resume / CV <span style={{ color: '#8B3A8F' }}>*</span>
                </label>
                <label htmlFor="careers-resume"
                  className={`flex flex-col items-center justify-center w-full py-7 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${dragOver ? 'border-[#8B3A8F] bg-[#faf5fb]' : 'border-neutral-200 hover:border-[#8B3A8F] hover:bg-[#faf5fb]'}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}>
                  <input id="careers-resume" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFile} required />
                  {form.resume ? (
                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#8B3A8F' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5 5h6M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                      {form.resume.name}
                    </div>
                  ) : (
                    <>
                      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" className="mb-2 text-neutral-300"><path d="M13 17V7M9 11l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 21h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      <p className="text-sm text-neutral-500">Drop your resume or <span style={{ color: '#8B3A8F' }} className="font-medium">browse</span></p>
                      <p className="text-xs text-neutral-400 mt-1">PDF, DOC, DOCX — max 5MB</p>
                    </>
                  )}
                </label>
              </div>

              {/* 2. Expected Salary */}
              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-1.5">
                  Expected Salary <span style={{ color: '#8B3A8F' }}>*</span>
                </label>
                <select name="expectedSalary" required value={form.expectedSalary} onChange={e => setForm(p => ({ ...p, expectedSalary: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-700 outline-none focus:border-[#8B3A8F] focus:shadow-[0_0_0_3px_rgba(139,58,143,0.1)] transition-all bg-white">
                  <option value="" disabled>Select expected salary</option>
                  {['Below ₹2 LPA', '₹2–4 LPA', '₹4–6 LPA', '₹6–10 LPA', '₹10–15 LPA', '₹15–20 LPA', '₹20–30 LPA', '₹30+ LPA'].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>

              <motion.button type="submit" disabled={submitting} whileHover={{ scale: submitting ? 1 : 1.02 }} whileTap={{ scale: submitting ? 1 : 0.97 }}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white mt-2 disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg, #8B3A8F, #7a3280)', boxShadow: '0 4px 16px rgba(139,58,143,0.35)' }}>
                {submitting ? 'Submitting...' : 'Submit Application'}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* ── Company Logo Placeholder ── */
const CompanyLogo = ({ name }) => {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#8B3A8F', '#F5A623', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6'];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
      style={{ background: color }}>
      {initials}
    </div>
  );
};

/* ── Role Detail Panel (slide-in from right) ── */
const RoleDetailPanel = ({ job, onClose, onApply, applied }) => {
  if (!job) return null;

  const InfoRow = ({ label, value }) => (
    <div>
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm text-neutral-800 font-medium">{value || '—'}</p>
    </div>
  );

  const postedDays = Math.max(1, Math.floor((Date.now() - new Date(job.createdAt)) / 86400000));
  const salaryStr = job.salaryMin && job.salaryMax
    ? `₹${Math.round(job.salaryMin/100000)}–${Math.round(job.salaryMax/100000)} LPA`
    : job.salaryMin
      ? `₹${Math.round(job.salaryMin/100000)} LPA+`
      : 'Not disclosed';

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[150] flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="absolute inset-0 bg-neutral-900/30 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="absolute right-0 top-0 bottom-0 bg-white shadow-2xl flex flex-col"
          style={{ width: 'min(640px, 100vw)' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-7 py-5 border-b border-neutral-100 shrink-0">
            <div className="flex items-start gap-3 flex-1 min-w-0 pr-4">
              <CompanyLogo name="Stryper Solution" />
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-neutral-900 truncate">{job.title}</h2>
                <p className="text-sm text-neutral-500">Stryper Solution</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    job.workMode === 'Remote' ? 'bg-green-50 text-green-700' :
                    job.workMode === 'Hybrid' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'
                  }`}>{job.workMode || 'On-site'}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">{job.employmentType || 'Full-Time'}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 transition-colors shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-3 divide-x divide-neutral-100 bg-neutral-50 border-b border-neutral-100 shrink-0">
            {[
              { label: 'Location',   value: job.location || 'Remote' },
              { label: 'Salary',     value: salaryStr },
              { label: 'Experience', value: job.experience || 'Fresher' },
            ].map(({ label, value }) => (
              <div key={label} className="py-3 px-4 text-center">
                <p className="text-xs font-semibold text-neutral-800 truncate">{value || '—'}</p>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">
            {/* Details grid */}
            <section>
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Job Details</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <InfoRow label="Location"    value={job.location || 'Remote'} />
                <InfoRow label="Work Mode"   value={job.workMode || 'On-site'} />
                <InfoRow label="Job Type"    value={job.employmentType || 'Full-Time'} />
                <InfoRow label="Experience"  value={job.experience || 'Fresher'} />
                <InfoRow label="Salary"      value={salaryStr} />
                <InfoRow label="Posted"      value={postedDays === 1 ? '1 day ago' : `${postedDays} days ago`} />
              </div>
            </section>

            <div className="border-t border-neutral-100" />

            {/* Description */}
            <section>
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Job Description</h3>
              <div className="bg-neutral-50 rounded-xl border border-neutral-100 px-5 py-4 text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {job.description || '—'}
              </div>
            </section>

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <>
                <div className="border-t border-neutral-100" />
                <section>
                  <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Requirements</h3>
                  <ul className="text-sm text-neutral-600 space-y-2 list-disc pl-4">
                    {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </section>
              </>
            )}

            {/* Skills */}
            {job.skills?.length > 0 && (
              <>
                <div className="border-t border-neutral-100" />
                <section>
                  <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map(s => (
                      <span key={s} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">{s}</span>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-7 py-4 border-t border-neutral-100 flex gap-3 shrink-0">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
              Close
            </button>
            <motion.button
              whileHover={!applied ? { scale: 1.02 } : {}} whileTap={!applied ? { scale: 0.97 } : {}}
              onClick={!applied ? () => { onClose(); onApply(); } : undefined}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${applied ? 'bg-green-50 text-green-600 border border-green-200' : 'text-white'}`}
              style={!applied ? { background: 'linear-gradient(135deg, #8B3A8F, #7a3280)' } : {}}
            >
              {applied ? '✓ Applied' : 'Apply Now'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
/* ── Stryper Job Card ── */
const StryperJobCard = ({ job, onApply, onView, applied }) => {
  const postedDays = Math.max(1, Math.floor((Date.now() - new Date(job.createdAt)) / 86400000));
  const salaryStr = job.salaryMin && job.salaryMax
    ? `₹${Math.round(job.salaryMin/100000)}–${Math.round(job.salaryMax/100000)} LPA`
    : job.salaryMin
      ? `₹${Math.round(job.salaryMin/100000)} LPA+`
      : 'Not disclosed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ y: -3, boxShadow: '0 12px 40px -8px rgba(139,58,143,0.15)' }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl border border-neutral-100 p-5 md:p-6 relative group cursor-pointer flex flex-col justify-between"
      onClick={() => onView(job)}
    >
      <div>
        <div className="flex items-start gap-4">
          <CompanyLogo name="Stryper Solution" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-neutral-900 text-base leading-snug group-hover:text-brand-purple-600 transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-neutral-500 mt-0.5">Stryper Solution</p>
          </div>
        </div>

        <p className="text-sm text-neutral-500 mt-3 leading-relaxed line-clamp-2">{job.description}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 1.5A4.5 4.5 0 0 1 12.5 6c0 3-4.5 8.5-4.5 8.5S3.5 9 3.5 6A4.5 4.5 0 0 1 8 1.5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>
            {job.location || 'Remote'}
          </span>
          <span className="flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" stroke="currentColor" strokeWidth="1.4"/></svg>
            {job.experience || 'Fresher'}
          </span>
          <span className="flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/><path d="M8 5v1.5l1 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            {postedDays === 1 ? '1 day ago' : `${postedDays} days ago`}
          </span>
          <span className="flex items-center gap-1 font-medium" style={{ color: '#8B3A8F' }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 8h12M8 2l6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {salaryStr}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            job.workMode === 'Remote' ? 'bg-green-50 text-green-700' :
            job.workMode === 'Hybrid' ? 'bg-blue-50 text-blue-700' :
            'bg-orange-50 text-orange-700'
          }`}>{job.workMode || 'On-site'}</span>
        </div>

        {job.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {job.skills.slice(0, 4).map(s => (
              <span key={s} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-neutral-50 text-neutral-600 border border-neutral-100">
                {s}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-neutral-50 text-neutral-500 border border-neutral-100">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-50" onClick={e => e.stopPropagation()}>
        <motion.button
          whileHover={!applied ? { scale: 1.03 } : {}} whileTap={!applied ? { scale: 0.97 } : {}}
          onClick={!applied ? () => onApply(job) : undefined}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            applied ? 'bg-green-50 text-green-600 border border-green-200' : 'text-white'
          }`}
          style={!applied ? { background: 'linear-gradient(135deg, #8B3A8F 0%, #7a3280 100%)', boxShadow: '0 4px 14px rgba(139,58,143,0.3)' } : {}}
        >
          {applied ? '✓ Applied' : 'Apply Now'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
          onClick={() => onView(job)}
          className="px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 transition-all"
        >
          View Role
        </motion.button>
      </div>
    </motion.div>
  );
};

/* ── Stryper Job Skeleton ── */
const StryperJobSkeleton = () => (
  <div className="bg-white rounded-2xl border border-neutral-100 p-6 animate-pulse">
    <div className="flex gap-4">
      <div className="w-12 h-12 rounded-xl bg-neutral-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-neutral-200 rounded w-2/3" />
        <div className="h-3 bg-neutral-100 rounded w-1/3" />
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-3 bg-neutral-100 rounded w-full" />
      <div className="h-3 bg-neutral-100 rounded w-4/5" />
    </div>
    <div className="mt-4 flex gap-2">
      {[1,2,3].map(i => <div key={i} className="h-6 w-16 bg-neutral-100 rounded-full" />)}
    </div>
  </div>
);

function Careers() {
  const { isLoggedIn } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingJob, setPendingJob] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  const [activeTab, setActiveTab] = useState('candidate');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);
  const [stryperJobs, setStryperJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [resume, setResume] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', roleType: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    jobsApi.getStryperJobs()
      .then(res => { if (res.data?.success) setStryperJobs(res.data.jobs || []); })
      .catch(() => {})
      .finally(() => setJobsLoading(false));
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setAppliedJobIds([]);
      return;
    }
    api.get('/applications/me')
      .then(res => setAppliedJobIds((res.data.applications || []).map(a => {
        const jid = a.jobId;
        return (typeof jid === 'object' && jid !== null) ? (jid._id || String(jid)) : String(jid);
      })))
      .catch(() => {});
  }, [isLoggedIn]);

  const handleApplyClick = (job) => {
    if (!isLoggedIn) {
      setPendingJob(job);
      setAuthOpen(true);
    } else {
      setApplyingJob(job);
    }
  };

  const handleAuthClose = () => {
    setAuthOpen(false);
    if (isLoggedIn && pendingJob) {
      setApplyingJob(pendingJob);
      setPendingJob(null);
    }
  };

  useEffect(() => {
    if (isLoggedIn && pendingJob && !authOpen) {
      setApplyingJob(pendingJob);
      setPendingJob(null);
    }
  }, [isLoggedIn, pendingJob, authOpen]);

  const scrollToApply = () => {
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      // Simulating upload
      setTimeout(() => {
        setResume(file);
        setUploading(false);
      }, 1500);
    }
  };

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <PageHero 
        title="Your Career Partner" 
        subtitle="Stryper Solution connects talent with India's top industries. Whether you're looking for a job or want to join our core team, we've got you covered." 
        breadcrumb="Careers" 
        image={img4}
      />

      {/* ── Selection Section (The "Dual Path") ── */}
      <section className="py-16 bg-white">
        <div className="container-base">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 text-center mb-6">Choose Your Path</h2>
            <div className="flex bg-neutral-100 p-1.5 rounded-2xl w-full max-w-md shadow-inner">
              <button 
                onClick={() => setActiveTab('candidate')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'candidate' ? 'bg-white text-brand-purple-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
              >
                I want a Job
              </button>
              <button 
                onClick={() => setActiveTab('corporate')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'corporate' ? 'bg-white text-brand-purple-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
              >
                Join Stryper Core Team
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'candidate' ? (
              <motion.div
                key="candidate"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full mb-4 inline-block">Workforce Solutions</span>
                  <h3 className="text-4xl font-bold text-neutral-900 leading-tight mb-6">
                    Let Us Help You Find <span style={{ color: P }}>The Right Opportunity</span>
                  </h3>
                  <p className="text-neutral-600 mb-8 leading-relaxed">
                    Stryper Solution works as an intermediary between top employers and skilled candidates. We don't just find you a job; we ensure you are deployed safely, paid on time, and supported throughout your career journey.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    {STRATEGY.map(item => (
                      <div key={item.title} className="flex gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <h4 className="font-bold text-neutral-800 text-sm">{item.title}</h4>
                          <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link to="/jobs" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold transition-transform hover:scale-105" style={{ background: P }}>
                    Browse Available Jobs
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
                <div className="relative">
                  <div className="bg-neutral-100 aspect-square rounded-[3rem] overflow-hidden rotate-3 shadow-2xl">
                    <img src={img4} alt="Candidate Support" className="w-full h-full object-cover -rotate-3 scale-110" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-neutral-100 max-w-[200px]">
                    <p className="text-3xl font-bold text-neutral-900 mb-1">5000+</p>
                    <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Candidates Placed Annually</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="corporate"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                <div className="max-w-3xl mx-auto text-center">
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full mb-4 inline-block">Internal Careers</span>
                  <h3 className="text-4xl font-bold text-neutral-900 leading-tight mb-6">
                    Build Your Career <span style={{ color: P }}>At Stryper HQ</span>
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Join the team that drives workforce innovation in India. We're looking for leaders in HR, Sales, Operations, and Technology to help us grow Stryper Solution to new heights.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                  {jobsLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <StryperJobSkeleton key={i} />
                    ))
                  ) : stryperJobs.length === 0 ? (
                    <div className="col-span-2 text-center py-12 text-neutral-400 text-sm">
                      No openings right now. Check back soon!
                    </div>
                  ) : stryperJobs.map(job => (
                    <StryperJobCard
                      key={job._id}
                      job={job}
                      applied={appliedJobIds.includes(String(job._id))}
                      onApply={(j) => handleApplyClick(j)}
                      onView={(j) => setSelectedJob(j)}
                    />
                  ))}
                </div>

                <div className="bg-neutral-900 rounded-[3rem] p-10 text-center text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-2xl font-bold mb-4">Ready to lead with us?</h4>
                    <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">We're always looking for exceptional talent. If you don't see a fit, send us your resume anyway.</p>
                    <button 
                      onClick={scrollToApply}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-neutral-900 font-bold hover:bg-neutral-100 transition-colors text-sm"
                    >
                      Submit General Application
                    </button>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── How it Works (Intermediate Process) ── */}
      <section className="py-20 bg-neutral-50 border-y border-neutral-100">
        <div className="container-base">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Our Placement Process</h2>
            <p className="text-sm text-neutral-500">Transparent, fast, and supportive. Here is how we get you from application to your first day at work.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step) => (
              <div key={step.s} className="relative group">
                <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl transition-all h-full">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-6 group-hover:scale-110 transition-transform" style={{ background: step.s % 2 === 0 ? G : P }}>
                    {step.s}
                  </div>
                  <h3 className="font-bold text-neutral-900 mb-3">{step.t}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{step.d}</p>
                </div>
                {step.s < 4 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-neutral-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Unified Application Section ── */}
      <section id="apply" className="py-24 bg-white overflow-hidden">
        <div className="container-base">
          <div className="max-w-5xl mx-auto">
            <div className="bg-neutral-50 rounded-[3rem] p-8 lg:p-16 relative overflow-hidden border border-neutral-100">
              <div className="grid lg:grid-cols-2 gap-12 relative z-10">
                <div>
                  <h2 className="text-4xl font-bold text-neutral-900 mb-6 leading-tight">Start Your <span style={{ color: P }}>Success Story</span></h2>
                  <p className="text-neutral-500 mb-8">Whether it's for an external industry role or an internal corporate position, fill out this form and we'll route it to the right team.</p>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">✨</div>
                      <p className="text-xs text-neutral-600 font-medium">Free application and assessment for all candidates.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">⚡</div>
                      <p className="text-xs text-neutral-600 font-medium">Fast-track recruitment through our pan-India network.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-purple-900/5">
                  {submitted ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-green-600">✓</div>
                      <h3 className="text-2xl font-bold text-neutral-900 mb-2">Application Sent!</h3>
                      <p className="text-sm text-neutral-500">Thank you for applying. Our HR team will review your profile and contact you soon.</p>
                      <button onClick={() => setSubmitted(false)} className="mt-6 text-brand-purple-600 font-bold text-sm hover:underline">Submit another application</button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <input type="text" name="name" required placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-neutral-50 border-none text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all" />
                        <input type="tel" name="phone" required placeholder="Phone Number" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-neutral-50 border-none text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all" />
                      </div>
                      <input type="email" name="email" required placeholder="Email Address" value={form.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-neutral-50 border-none text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all" />
                      <select name="roleType" required value={form.roleType} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-neutral-50 border-none text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all appearance-none">
                        <option value="" disabled>Preferred Role Type</option>
                        <option value="Client">Client / Industry Job</option>
                        <option value="Stryper">Stryper Corporate Role</option>
                      </select>
                      
                      <div className="relative">
                        <input 
                          type="file" 
                          id="resume-upload" 
                          className="hidden" 
                          accept=".pdf,.doc,.docx" 
                          onChange={handleFileUpload}
                          disabled={uploading}
                        />
                        <label 
                          htmlFor="resume-upload"
                          className={`flex flex-col items-center justify-center w-full py-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                            resume ? 'border-green-200 bg-green-50/30' : 
                            uploading ? 'border-purple-200 bg-purple-50/30' :
                            'border-neutral-100 hover:bg-neutral-50'
                          }`}
                        >
                          {uploading ? (
                            <div className="flex flex-col items-center">
                              <div className="w-6 h-6 border-2 border-brand-purple-600 border-t-transparent rounded-full animate-spin mb-2" />
                              <p className="text-xs text-brand-purple-600 font-bold">Uploading Resume...</p>
                            </div>
                          ) : resume ? (
                            <div className="flex flex-col items-center">
                              <span className="text-2xl mb-1">📄</span>
                              <p className="text-xs text-green-700 font-bold">{resume.name}</p>
                              <p className="text-[10px] text-green-500 mt-0.5">Click to change</p>
                            </div>
                          ) : (
                            <>
                              <span className="text-2xl mb-2">☁️</span>
                              <p className="text-xs text-neutral-400 font-medium">Click to upload Resume / CV</p>
                              <p className="text-[10px] text-neutral-300 mt-1 uppercase tracking-widest font-bold">PDF, DOC, DOCX</p>
                            </>
                          )}
                        </label>
                      </div>

                      <button 
                        type="submit"
                        disabled={uploading}
                        className={`w-full py-4 rounded-xl text-white font-bold shadow-lg shadow-purple-200 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`} 
                        style={{ background: P }}
                      >
                        Submit Application
                      </button>
                    </form>
                  )}
                </div>
              </div>
              
              {/* Decorative blobs */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-purple-100 rounded-full blur-[100px] opacity-50" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-100 rounded-full blur-[100px] opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* Role Detail Panel */}
      {selectedJob && (
        <RoleDetailPanel
          job={selectedJob}
          applied={appliedJobIds.includes(String(selectedJob._id))}
          onClose={() => setSelectedJob(null)}
          onApply={() => { handleApplyClick(selectedJob); setSelectedJob(null); }}
        />
      )}

      {/* Apply Modal */}
      <AnimatePresence>
        {applyingJob && (
          <ApplyModal
            job={applyingJob}
            onClose={() => setApplyingJob(null)}
            onApplied={(id) => { setAppliedJobIds(p => [...p, String(id)]); setApplyingJob(null); }}
          />
        )}
      </AnimatePresence>

      {/* Auth Modal — shown when unauthenticated user clicks Apply */}
      <AuthModal
        isOpen={authOpen}
        onClose={handleAuthClose}
        defaultView="signup-find-job"
      />
    </>
  );
}

export default Careers;
