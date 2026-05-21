import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/auth/AuthModal';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_JOBS = [
  {
    id: 1, featured: true,
    title: 'Senior React Developer', company: 'TechCorp India', location: 'Bangalore', locationType: 'Hybrid',
    experience: '3-6 Years', salary: '₹12 - 20 LPA', type: 'Full-time', industry: 'IT / Software',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'], postedDays: 1,
    desc: 'Build scalable web applications using React and modern frontend tooling. Work with cross-functional teams.',
    logo: null,
  },
  {
    id: 2, featured: true,
    title: 'UI/UX Designer', company: 'DesignStudio', location: 'Mumbai', locationType: 'Remote',
    experience: '2-4 Years', salary: '₹8 - 14 LPA', type: 'Full-time', industry: 'Design',
    skills: ['Figma', 'Prototyping', 'User Research', 'Tailwind'], postedDays: 2,
    desc: 'Create beautiful, user-centric designs for web and mobile products. Own the design system.',
    logo: null,
  },
  {
    id: 3, featured: false,
    title: 'DevOps Engineer', company: 'CloudBase', location: 'Hyderabad', locationType: 'Onsite',
    experience: '4-8 Years', salary: '₹15 - 25 LPA', type: 'Full-time', industry: 'IT / Software',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform'], postedDays: 3,
    desc: 'Manage cloud infrastructure, automate deployments, and ensure system reliability at scale.',
    logo: null,
  },
  {
    id: 4, featured: false,
    title: 'Digital Marketing Manager', company: 'GrowthHive', location: 'Delhi', locationType: 'Hybrid',
    experience: '3-5 Years', salary: '₹7 - 12 LPA', type: 'Full-time', industry: 'Marketing',
    skills: ['SEO', 'Google Ads', 'Meta Ads', 'Analytics'], postedDays: 5,
    desc: 'Lead digital campaigns, manage paid media budgets, and drive measurable growth.',
    logo: null,
  },
  {
    id: 5, featured: false,
    title: 'Backend Engineer (Python)', company: 'DataFlow', location: 'Pune', locationType: 'Remote',
    experience: '2-5 Years', salary: '₹10 - 18 LPA', type: 'Full-time', industry: 'IT / Software',
    skills: ['Python', 'Django', 'PostgreSQL', 'Redis'], postedDays: 7,
    desc: 'Design and build robust APIs and microservices. Work on high-traffic data pipelines.',
    logo: null,
  },
  {
    id: 6, featured: false,
    title: 'Cybersecurity Analyst', company: 'SecureNet', location: 'Chennai', locationType: 'Onsite',
    experience: '1-3 Years', salary: '₹6 - 10 LPA', type: 'Full-time', industry: 'Cybersecurity',
    skills: ['SIEM', 'Penetration Testing', 'OWASP', 'Linux'], postedDays: 8,
    desc: 'Monitor, detect, and respond to security incidents. Conduct vulnerability assessments.',
    logo: null,
  },
  {
    id: 7, featured: false,
    title: 'AI/ML Engineer', company: 'NeuralWorks', location: 'Bangalore', locationType: 'Hybrid',
    experience: '2-5 Years', salary: '₹14 - 24 LPA', type: 'Full-time', industry: 'AI / ML',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps'], postedDays: 10,
    desc: 'Build and deploy machine learning models. Work on NLP and computer vision projects.',
    logo: null,
  },
  {
    id: 8, featured: false,
    title: 'HR Business Partner', company: 'PeopleFirst', location: 'Mumbai', locationType: 'Onsite',
    experience: '4-7 Years', salary: '₹9 - 15 LPA', type: 'Full-time', industry: 'HR',
    skills: ['Talent Acquisition', 'HRBP', 'Compliance', 'L&D'], postedDays: 12,
    desc: 'Partner with business leaders to drive HR strategy, talent management, and culture.',
    logo: null,
  },
];

const TOP_COMPANIES = [
  { name: 'TechCorp', jobs: 12 }, { name: 'DesignStudio', jobs: 5 },
  { name: 'CloudBase', jobs: 8 }, { name: 'GrowthHive', jobs: 6 },
  { name: 'DataFlow', jobs: 9 }, { name: 'SecureNet', jobs: 4 },
];

const JOBS_PER_PAGE = 5;

// ─── Shimmer Skeleton ─────────────────────────────────────────────────────────
const JobSkeleton = () => (
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

// ─── Company Logo Placeholder ─────────────────────────────────────────────────
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

// ─── Apply Modal ─────────────────────────────────────────────────────────────
const ApplyModal = ({ job, onClose }) => {
  const [form, setForm] = useState({ resume: null, experience: '', expectedSalary: '', noticePeriod: '', currentLocation: '' });
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleFile = e => setForm(p => ({ ...p, resume: e.target.files[0] || null }));
  const handleDrop = e => { e.preventDefault(); setDragOver(false); setForm(p => ({ ...p, resume: e.dataTransfer.files[0] || null })); };
  const handleSubmit = e => { e.preventDefault(); setSubmitted(true); };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}>
        <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }}
          onClick={e => e.stopPropagation()}>

          {submitted ? (
            <div className="p-10 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#faf5fb' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M5 14l6 6 12-12" stroke="#8B3A8F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="font-display font-bold text-neutral-900 text-xl mb-2">Application Submitted!</h3>
              <p className="text-sm text-neutral-500 mb-6">We'll review your profile and reach out within 48 hours.</p>
              <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#8B3A8F' }}>Close</button>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-display font-bold text-neutral-900 text-lg leading-snug">Apply for Position</h2>
                  <p className="text-sm text-neutral-500 mt-0.5">{job.title} · {job.company}</p>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100 transition-colors shrink-0 ml-4">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* 1. Resume Upload */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-1.5">
                    Resume / CV <span style={{ color: '#8B3A8F' }}>*</span>
                  </label>
                  <label htmlFor="job-resume"
                    className={`flex flex-col items-center justify-center w-full py-7 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${dragOver ? 'border-[#8B3A8F] bg-[#faf5fb]' : 'border-neutral-200 hover:border-[#8B3A8F] hover:bg-[#faf5fb]'}`}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}>
                    <input id="job-resume" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFile} required />
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

                {/* 2. Experience */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-1.5">
                    Total Experience <span style={{ color: '#8B3A8F' }}>*</span>
                  </label>
                  <select name="experience" required value={form.experience} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-700 outline-none focus:border-[#8B3A8F] focus:shadow-[0_0_0_3px_rgba(139,58,143,0.1)] transition-all bg-white">
                    <option value="" disabled>Select experience</option>
                    {['Fresher (0 yrs)', '0–1 Year', '1–2 Years', '2–3 Years', '3–5 Years', '5–8 Years', '8–10 Years', '10+ Years'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>

                {/* 3. Expected Salary */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-1.5">
                    Expected Salary <span style={{ color: '#8B3A8F' }}>*</span>
                  </label>
                  <select name="expectedSalary" required value={form.expectedSalary} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-700 outline-none focus:border-[#8B3A8F] focus:shadow-[0_0_0_3px_rgba(139,58,143,0.1)] transition-all bg-white">
                    <option value="" disabled>Select expected salary</option>
                    {['Below ₹2 LPA', '₹2–4 LPA', '₹4–6 LPA', '₹6–10 LPA', '₹10–15 LPA', '₹15–20 LPA', '₹20–30 LPA', '₹30+ LPA'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>

                {/* 4. Notice Period */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-1.5">
                    Notice Period <span style={{ color: '#8B3A8F' }}>*</span>
                  </label>
                  <select name="noticePeriod" required value={form.noticePeriod} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-700 outline-none focus:border-[#8B3A8F] focus:shadow-[0_0_0_3px_rgba(139,58,143,0.1)] transition-all bg-white">
                    <option value="" disabled>Select notice period</option>
                    {['Immediate Joiner', '15 Days', '1 Month', '2 Months', '3 Months', 'More than 3 Months'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>

                {/* 5. Current Location */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-1.5">
                    Current Location <span style={{ color: '#8B3A8F' }}>*</span>
                  </label>
                  <input name="currentLocation" type="text" required placeholder="e.g. Mumbai, Maharashtra"
                    value={form.currentLocation} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-700 placeholder-neutral-400 outline-none focus:border-[#8B3A8F] focus:shadow-[0_0_0_3px_rgba(139,58,143,0.1)] transition-all" />
                </div>

                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white mt-2"
                  style={{ background: 'linear-gradient(135deg, #8B3A8F, #7a3280)', boxShadow: '0 4px 16px rgba(139,58,143,0.35)' }}>
                  Submit Application
                </motion.button>
              </form>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Job Card ─────────────────────────────────────────────────────────────────
const JobCard = ({ job, saved, onSave, onApply }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    whileHover={{ y: -3, boxShadow: '0 12px 40px -8px rgba(139,58,143,0.15)' }}
    transition={{ duration: 0.25 }}
    className="bg-white rounded-2xl border border-neutral-100 p-5 md:p-6 relative group cursor-pointer"
  >
    {job.featured && (
      <span className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full"
        style={{ background: '#faf5fb', color: '#8B3A8F', border: '1px solid #e4d0e9' }}>
        ⭐ Featured
      </span>
    )}

    <div className="flex items-start gap-4">
      <CompanyLogo name={job.company} />
      <div className="flex-1 min-w-0 pr-16">
        <h3 className="font-semibold text-neutral-900 text-base leading-snug group-hover:text-brand-purple-600 transition-colors">
          {job.title}
        </h3>
        <p className="text-sm text-neutral-500 mt-0.5">{job.company}</p>
      </div>
    </div>

    <p className="text-sm text-neutral-500 mt-3 leading-relaxed line-clamp-2">{job.desc}</p>

    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 text-xs text-neutral-500">
      <span className="flex items-center gap-1">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 1.5A4.5 4.5 0 0 1 12.5 6c0 3-4.5 8.5-4.5 8.5S3.5 9 3.5 6A4.5 4.5 0 0 1 8 1.5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>
        {job.location}
      </span>
      <span className="flex items-center gap-1">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" stroke="currentColor" strokeWidth="1.4"/></svg>
        {job.experience}
      </span>
      <span className="flex items-center gap-1">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/><path d="M8 5v1.5l1 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
        {job.postedDays === 1 ? '1 day ago' : `${job.postedDays} days ago`}
      </span>
      <span className="flex items-center gap-1 font-medium" style={{ color: '#8B3A8F' }}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 8h12M8 2l6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        {job.salary}
      </span>
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
        job.locationType === 'Remote' ? 'bg-green-50 text-green-700' :
        job.locationType === 'Hybrid' ? 'bg-blue-50 text-blue-700' :
        'bg-orange-50 text-orange-700'
      }`}>{job.locationType}</span>
    </div>

    <div className="flex flex-wrap gap-1.5 mt-3">
      {job.skills.map(s => (
        <span key={s} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-neutral-50 text-neutral-600 border border-neutral-100">
          {s}
        </span>
      ))}
    </div>

    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-50">
      <motion.button
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        onClick={onApply}
        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
        style={{ background: 'linear-gradient(135deg, #8B3A8F 0%, #7a3280 100%)', boxShadow: '0 4px 14px rgba(139,58,143,0.3)' }}
      >
        Apply Now
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
        onClick={() => onSave(job.id)}
        className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
          saved ? 'border-brand-purple-300 bg-brand-purple-50' : 'border-neutral-200 hover:border-brand-purple-300'
        }`}
        aria-label="Save job"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill={saved ? '#8B3A8F' : 'none'}>
          <path d="M3 2h10a1 1 0 0 1 1 1v11l-6-3-6 3V3a1 1 0 0 1 1-1z" stroke="#8B3A8F" strokeWidth="1.4" strokeLinejoin="round"/>
        </svg>
      </motion.button>
    </div>
  </motion.div>
);

// ─── Filter Sidebar ───────────────────────────────────────────────────────────
const FilterSidebar = ({ filters, setFilters, onReset }) => {
  const Section = ({ title, children }) => {
    const [open, setOpen] = useState(true);
    return (
      <div className="border-b border-neutral-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
        <button onClick={() => setOpen(o => !o)}
          className="flex items-center justify-between w-full text-sm font-semibold text-neutral-800 mb-3">
          {title}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            className={`transition-transform ${open ? 'rotate-180' : ''}`}>
            <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        {open && children}
      </div>
    );
  };

  const Radio = ({ name, value, label, current, onChange }) => (
    <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer hover:text-brand-purple-600 py-0.5">
      <input type="radio" name={name} value={value} checked={current === value}
        onChange={() => onChange(value)}
        className="accent-brand-purple-500 w-3.5 h-3.5" />
      {label}
    </label>
  );

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-soft sticky top-24">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-neutral-900 text-base flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 8h8M6 12h4" stroke="#8B3A8F" strokeWidth="1.6" strokeLinecap="round"/></svg>
          Filters
        </h2>
        <button onClick={onReset} className="text-xs font-medium hover:underline" style={{ color: '#8B3A8F' }}>
          Reset all
        </button>
      </div>

      <Section title="Date Posted">
        {['Any time', 'Last 24 hours', 'Last 3 days', 'Last week', 'Last month'].map(v => (
          <Radio key={v} name="date" value={v} label={v} current={filters.date} onChange={v => setFilters(f => ({ ...f, date: v }))} />
        ))}
      </Section>

      <Section title="Job Type">
        {['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'].map(v => (
          <Radio key={v} name="type" value={v} label={v} current={filters.type} onChange={v => setFilters(f => ({ ...f, type: v }))} />
        ))}
      </Section>

      <Section title="Work Mode">
        {['Remote', 'Hybrid', 'Onsite'].map(v => (
          <Radio key={v} name="mode" value={v} label={v} current={filters.mode} onChange={v => setFilters(f => ({ ...f, mode: v }))} />
        ))}
      </Section>

      <Section title="Experience Level">
        {['0-1 Years', '1-3 Years', '3-6 Years', '6-10 Years', '10+ Years'].map(v => (
          <Radio key={v} name="exp" value={v} label={v} current={filters.exp} onChange={v => setFilters(f => ({ ...f, exp: v }))} />
        ))}
      </Section>

      <Section title="Salary Range">
        {['0-5 LPA', '5-10 LPA', '10-20 LPA', '20-40 LPA', '40+ LPA'].map(v => (
          <Radio key={v} name="salary" value={v} label={v} current={filters.salary} onChange={v => setFilters(f => ({ ...f, salary: v }))} />
        ))}
      </Section>
    </div>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({ current, total, onChange }) => {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1}
        className="px-3 py-2 rounded-xl text-sm font-medium border border-neutral-200 text-neutral-600 hover:border-brand-purple-300 hover:text-brand-purple-600 disabled:opacity-40 transition-all">
        ← Prev
      </button>
      {pages.map(p => (
        <button key={p} onClick={() => onChange(p)}
          className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
            p === current
              ? 'text-white shadow-purple'
              : 'border border-neutral-200 text-neutral-600 hover:border-brand-purple-300 hover:text-brand-purple-600'
          }`}
          style={p === current ? { background: '#8B3A8F' } : {}}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(Math.min(total, current + 1))} disabled={current === total}
        className="px-3 py-2 rounded-xl text-sm font-medium border border-neutral-200 text-neutral-600 hover:border-brand-purple-300 hover:text-brand-purple-600 disabled:opacity-40 transition-all">
        Next →
      </button>
    </div>
  );
};

// ─── Main Jobs Page ───────────────────────────────────────────────────────────
const Jobs = () => {
  const { isLoggedIn } = useAuth();
  const [search, setSearch] = useState({ keyword: '', location: '', experience: '', salary: '' });
  const [filters, setFilters] = useState({ date: 'Any time', type: '', mode: '', exp: '', salary: '' });
  const [savedJobs, setSavedJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [applyJob, setApplyJob] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingJob, setPendingJob] = useState(null); // job waiting after login

  // Called when Apply Now is clicked
  const handleApplyClick = (job) => {
    if (!isLoggedIn) {
      setPendingJob(job);
      setAuthOpen(true);
    } else {
      setApplyJob(job);
    }
  };

  // Called when auth modal closes — if user just logged in, open apply modal
  const handleAuthClose = () => {
    setAuthOpen(false);
    if (isLoggedIn && pendingJob) {
      setApplyJob(pendingJob);
      setPendingJob(null);
    }
  };

  // If user logs in while auth modal is open, auto-open apply modal
  useEffect(() => {
    if (isLoggedIn && pendingJob && !authOpen) {
      setApplyJob(pendingJob);
      setPendingJob(null);
    }
  }, [isLoggedIn, pendingJob, authOpen]);

  const toggleSave = (id) =>
    setSavedJobs(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const resetFilters = () =>
    setFilters({ date: 'Any time', type: '', mode: '', exp: '', salary: '' });

  const filtered = useMemo(() => {
    return MOCK_JOBS.filter(j => {
      if (search.keyword && !j.title.toLowerCase().includes(search.keyword.toLowerCase()) &&
          !j.company.toLowerCase().includes(search.keyword.toLowerCase()) &&
          !j.skills.some(s => s.toLowerCase().includes(search.keyword.toLowerCase()))) return false;
      if (search.location && !j.location.toLowerCase().includes(search.location.toLowerCase())) return false;
      if (filters.type && j.type !== filters.type) return false;
      if (filters.mode && j.locationType !== filters.mode) return false;
      return true;
    });
  }, [search, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / JOBS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); };

  return (
    <>
    <div className="min-h-screen bg-neutral-50">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-28 pb-16"
        style={{ background: 'linear-gradient(135deg, #3d1940 0%, #662a6b 40%, #8B3A8F 70%, #7a3280 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-brand-gold-400/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold tracking-wide uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-400 animate-pulse" />
              {filtered.length} Jobs Available
            </span>
            <h1 className="font-display font-bold text-white mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Find Your Dream Job
            </h1>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
              Explore top opportunities from trusted companies across India.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form onSubmit={handleSearch}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-white rounded-2xl shadow-2xl p-3 md:p-4 flex flex-col md:flex-row gap-2 md:gap-3 max-w-4xl mx-auto">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-100">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-neutral-400 shrink-0">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input value={search.keyword} onChange={e => setSearch(s => ({ ...s, keyword: e.target.value }))}
                placeholder="Job title, keyword, or company..."
                className="bg-transparent text-sm text-neutral-700 placeholder-neutral-400 outline-none w-full" />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-100 md:w-40">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-neutral-400 shrink-0">
                <path d="M8 1.5A4.5 4.5 0 0 1 12.5 6c0 3-4.5 8.5-4.5 8.5S3.5 9 3.5 6A4.5 4.5 0 0 1 8 1.5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
              </svg>
              <input value={search.location} onChange={e => setSearch(s => ({ ...s, location: e.target.value }))}
                placeholder="Location"
                className="bg-transparent text-sm text-neutral-700 placeholder-neutral-400 outline-none w-full" />
            </div>
            <select value={search.experience} onChange={e => setSearch(s => ({ ...s, experience: e.target.value }))}
              className="px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-100 text-sm text-neutral-600 outline-none md:w-36">
              <option value="">Experience</option>
              {['0-1 Years','1-3 Years','3-6 Years','6-10 Years','10+ Years'].map(v => <option key={v}>{v}</option>)}
            </select>
            <select value={search.salary} onChange={e => setSearch(s => ({ ...s, salary: e.target.value }))}
              className="px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-100 text-sm text-neutral-600 outline-none md:w-32">
              <option value="">Salary</option>
              {['0-5 LPA','5-10 LPA','10-20 LPA','20-40 LPA','40+ LPA'].map(v => <option key={v}>{v}</option>)}
            </select>
            <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all"
              style={{ background: 'linear-gradient(135deg, #8B3A8F, #F5A623)', boxShadow: '0 4px 16px rgba(139,58,143,0.4)' }}>
              Search
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* ── TOP COMPANIES STRIP ── */}
      <section className="bg-white border-b border-neutral-100 py-4 overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide shrink-0">Top Hiring:</span>
            {TOP_COMPANIES.map(c => (
              <div key={c.name} className="flex items-center gap-2 shrink-0 cursor-pointer group">
                <CompanyLogo name={c.name} />
                <div>
                  <p className="text-xs font-semibold text-neutral-700 group-hover:text-brand-purple-600 transition-colors">{c.name}</p>
                  <p className="text-[10px] text-neutral-400">{c.jobs} openings</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="container mx-auto px-4 max-w-6xl py-8">
        <div className="flex gap-6">

          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FilterSidebar filters={filters} setFilters={setFilters} onReset={resetFilters} />
          </aside>

          {/* Jobs Column */}
          <div className="flex-1 min-w-0">

            {/* Mobile filter toggle */}
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <p className="text-sm text-neutral-500">{filtered.length} jobs found</p>
              <button onClick={() => setMobileFiltersOpen(o => !o)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-700">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                Filters
              </button>
            </div>

            {/* Mobile filters drawer */}
            <AnimatePresence>
              {mobileFiltersOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4 lg:hidden">
                  <FilterSidebar filters={filters} setFilters={setFilters} onReset={resetFilters} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header row */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-neutral-900 text-lg">
                  {search.keyword || filters.type || filters.mode ? 'Search Results' : 'Recommended Jobs'}
                  <span className="ml-2 text-sm font-normal text-neutral-400">({filtered.length})</span>
                </h2>
              </div>
              <select className="text-sm border border-neutral-200 rounded-xl px-3 py-2 text-neutral-600 outline-none bg-white">
                <option>Most Relevant</option>
                <option>Newest First</option>
                <option>Highest Salary</option>
              </select>
            </div>

            {/* Job list */}
            {loading ? (
              <div className="space-y-4">{[1,2,3].map(i => <JobSkeleton key={i} />)}</div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="13" cy="13" r="9" stroke="#a3a3a3" strokeWidth="2"/><path d="M20 20l5 5" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
                <h3 className="font-semibold text-neutral-700 mb-1">No jobs found</h3>
                <p className="text-sm text-neutral-400">Try adjusting your search or filters.</p>
                <button onClick={resetFilters} className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: '#8B3A8F' }}>Clear Filters</button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="space-y-4">
                  {paginated.map(job => (
                    <JobCard key={job.id} job={job} saved={savedJobs.includes(job.id)} onSave={toggleSave} onApply={() => handleApplyClick(job)} />
                  ))}
                </div>
              </AnimatePresence>
            )}

            {/* Pagination */}
            {filtered.length > JOBS_PER_PAGE && (
              <Pagination current={page} total={totalPages} onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            )}
          </div>
        </div>
      </div>

      {/* ── JOBS FOOTER ── */}
      <footer className="mt-12" style={{ background: '#1a0d1b' }}>
        <div className="container mx-auto px-4 max-w-6xl py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Col 1 */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wide">Useful Links</h4>
              <ul className="space-y-2.5">
                {[['Home','/'],['About','/about'],['Careers','/careers'],['Contact','/contact'],['Terms','#']].map(([l,p]) => (
                  <li key={l}><Link to={p} className="text-neutral-400 text-sm hover:text-white transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            {/* Col 2 */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wide">Browse Job Categories</h4>
              <ul className="space-y-2.5">
                {['Web Development','Backend Development','Cyber Security','UI/UX Design','Digital Marketing','AI / ML'].map(c => (
                  <li key={c}><button className="text-neutral-400 text-sm hover:text-white transition-colors text-left">{c}</button></li>
                ))}
              </ul>
            </div>
            {/* Col 3 */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wide">Contact Us</h4>
              <div className="space-y-3 text-sm text-neutral-400">
                <p className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4l6 5 6-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/></svg>
                  Strypersolutionpvtltd@gmail.com
                </p>
                <p className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 2h3l1.5 3.5-2 1.5a9 9 0 0 0 3.5 3.5l1.5-2L14 10v3a1 1 0 0 1-1 1A12 12 0 0 1 2 3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
                  +91 84485 80303
                </p>
                <div className="flex gap-3 mt-4">
                  {['f','t','in'].map(s => (
                    <button key={s} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-brand-purple-600 flex items-center justify-center text-white text-xs font-bold transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-5">
          <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
            <p>© {new Date().getFullYear()} Stryper Solution Pvt. Ltd. All rights reserved.</p>
            <div className="flex gap-4">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>
    </div>

    {/* Apply Modal */}
    {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}

    {/* Auth Modal — shown when unauthenticated user clicks Apply */}
    <AuthModal
      isOpen={authOpen}
      onClose={handleAuthClose}
      defaultView="signup-find-job"
    />
    </>
  );
};

export default Jobs;
