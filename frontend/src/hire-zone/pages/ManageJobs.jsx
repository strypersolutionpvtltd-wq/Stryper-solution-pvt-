import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import SectionHeader from '@/hire-zone/components/shared/SectionHeader';
import JobCard from '@/hire-zone/components/jobs/JobCard';
import EmptyState from '@/hire-zone/components/shared/EmptyState';
import StatusBadge from '@/hire-zone/components/shared/StatusBadge';
import { MOCK_JOBS } from '@/hire-zone/data/mockJobs';
import toast from 'react-hot-toast';
import { Loader2, X, MapPin, Save } from 'lucide-react';

const STATUS_FILTERS = ['All', 'Active', 'Draft', 'Paused', 'Closed'];

const WORK_MODES = ['On-site', 'Remote', 'Hybrid'];
const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const DEPARTMENTS = ['Engineering','Design','Product','Marketing','Sales','Human Resources','Finance','Operations','Analytics','Customer Support','Other'];
const EXPERIENCE_LEVELS = ['Fresher','0-1 yrs','1-3 yrs','3-5 yrs','5-8 yrs','8-10 yrs','10+ yrs'];

const LOCATION_SUGG = [
  'Remote', 'Hybrid', 'Work From Home', 'Gurugram, Haryana', 'Noida, Uttar Pradesh',
  'Bengaluru, Karnataka', 'Mumbai, Maharashtra', 'Hyderabad, Telangana', 'Pune, Maharashtra',
  'Chennai, Tamil Nadu', 'Kolkata, West Bengal', 'Jaipur, Rajasthan', 'Ahmedabad, Gujarat', 'Delhi, Delhi'
];

const SKILL_SUGG = [
  'React.js','Next.js','Vue.js','Angular','JavaScript','TypeScript','HTML','CSS','Tailwind CSS','Redux','Node.js','Express.js','NestJS','Django','Flask','FastAPI','Spring Boot','Laravel','PHP','Go','Python','Java','C','C++','C#','Ruby','Swift','Dart','Kotlin','React Native','Flutter','Android Development','iOS Development','MongoDB','PostgreSQL','MySQL','Redis','Firebase','Supabase','Elasticsearch','AWS','Azure','GCP','Docker','Kubernetes','Terraform','CI/CD','Linux','DevOps','Microservices','Machine Learning','Deep Learning','NLP','TensorFlow','PyTorch','Data Analysis','Data Science','SQL','Power BI','Tableau','REST APIs','GraphQL','System Design','Full Stack Development','Jest','Cypress','Selenium','Unit Testing','QA Testing','Automation Testing','Figma','Adobe XD','UI/UX Design','Wireframing','Prototyping','Git','GitHub','Jira','Postman','Agile','Scrum','Project Management','SEO','SEM','Google Ads','Content Marketing','Digital Marketing','Salesforce','CRM','Financial Analysis','Accounting','SAP','Tally','MS Excel','Budgeting','GST','Recruitment','HR Management','Payroll','Talent Acquisition','Leadership','Communication','Problem Solving','Time Management','Customer Service'
];

// ── Edit Job Modal ──────────────────────────────────────────────────────────
const EditJobModal = ({ job, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: '',
    department: '',
    customDepartment: '',
    description: '',
    salaryMin: '',
    salaryMax: '',
    experience: '',
    location: '',
    employmentType: 'Full-time',
    workMode: 'On-site',
    skills: [],
    skillInput: '',
    deadline: '',
    openings: 1,
  });

  const [saving, setSaving] = useState(false);
  const [locSugg, setLocSugg] = useState([]);
  const [showLocDrop, setShowLocDrop] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [showSkillSugg, setShowSkillSugg] = useState(false);

  const locDebounce = useRef(null);
  const locRef = useRef(null);
  const skillRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (locRef.current && !locRef.current.contains(e.target)) setShowLocDrop(false);
      if (skillRef.current && !skillRef.current.contains(e.target)) setShowSkillSugg(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (job) {
      const isCustomDept = job.department && !DEPARTMENTS.includes(job.department);
      setForm({
        title: job.title || '',
        department: isCustomDept ? 'Other' : (job.department || ''),
        customDepartment: isCustomDept ? job.department : '',
        description: job.description || '',
        salaryMin: job.salaryMin || '',
        salaryMax: job.salaryMax || '',
        experience: job.experience || '',
        location: job.location || '',
        employmentType: job.employmentType || 'Full-time',
        workMode: job.workMode || 'On-site',
        skills: Array.isArray(job.skills) ? job.skills : [],
        skillInput: '',
        deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
        openings: job.openings || 1,
      });
    }
  }, [job]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleLocChange = (val) => {
    set('location', val);
    setShowLocDrop(false);
    if (locDebounce.current) clearTimeout(locDebounce.current);
    if (!val.trim()) { setLocSugg([]); return; }
    const staticM = LOCATION_SUGG.filter(l => l.toLowerCase().includes(val.toLowerCase()));
    if (val.length < 2) { setLocSugg(staticM); setShowLocDrop(staticM.length > 0); return; }
    locDebounce.current = setTimeout(async () => {
      setLocLoading(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&countrycodes=in&format=json&addressdetails=1&limit=8`, { headers: { 'Accept-Language': 'en' } });
        const data = await res.json();
        const api = data.filter(i => i.address).map(i => {
          const a = i.address;
          const city = a.city || a.town || a.village || a.county || '';
          const state = a.state || '';
          return city && state ? `${city}, ${state}` : state || i.display_name.split(',').slice(0, 2).join(',').trim();
        }).filter((v, i, arr) => v && arr.indexOf(v) === i).slice(0, 6);
        const combined = [...staticM, ...api.filter(r => !staticM.includes(r))].slice(0, 8);
        setLocSugg(combined); setShowLocDrop(combined.length > 0);
      } catch { setLocSugg(staticM); setShowLocDrop(staticM.length > 0); }
      finally { setLocLoading(false); }
    }, 350);
  };

  const norm = (s) => s.toLowerCase().replace(/[\s\-_.]/g, '');
  const filteredSkills = useMemo(() => {
    const q = form.skillInput.trim();
    if (!q) return SKILL_SUGG.filter(s => !form.skills.includes(s)).slice(0, 12);
    return SKILL_SUGG.filter(s => norm(s).includes(norm(q)) && !form.skills.includes(s)).slice(0, 10);
  }, [form.skillInput, form.skills]);

  const addSkill = (s) => {
    const tag = s.trim().replace(/,$/, '');
    if (tag && !form.skills.includes(tag)) set('skills', [...form.skills, tag]);
    set('skillInput', ''); setShowSkillSugg(false);
  };
  const removeSkill = (s) => set('skills', form.skills.filter(x => x !== s));
  const handleSkillKey = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && form.skillInput.trim()) { e.preventDefault(); addSkill(form.skillInput); }
    if (e.key === 'Escape') setShowSkillSugg(false);
  };

  const handleSubmit = (status) => {
    if (!form.title.trim()) {
      toast.error('Job title is required');
      return;
    }
    if (!form.description.trim()) {
      toast.error('Job description is required');
      return;
    }
    setSaving(true);
    onSave({
      ...job,
      title: form.title,
      department: form.department === 'Other' ? form.customDepartment : form.department,
      description: form.description,
      salaryMin: form.salaryMin ? parseInt(form.salaryMin) : null,
      salaryMax: form.salaryMax ? parseInt(form.salaryMax) : null,
      experience: form.experience,
      location: form.location,
      employmentType: form.employmentType,
      type: form.employmentType,
      workMode: form.workMode,
      skills: form.skills,
      deadline: form.deadline || null,
      openings: form.openings ? parseInt(form.openings) : 1,
      status: status || job.status,
    });
  };

  const labelCls = 'block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5';
  const inputCls = 'w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all';
  const selectCls = 'w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative bg-white rounded-[2rem] border border-neutral-200 w-full max-w-2xl shadow-2xl text-neutral-800 flex flex-col max-h-[90vh] overflow-hidden z-[70]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-neutral-100 shrink-0">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Edit — {job?.title}</h2>
              <p className="text-xs text-neutral-400 mt-0.5">External job — shown to candidates on /jobs page</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          <div className="overflow-y-auto flex-1 p-8 space-y-6">
            {/* Section 1 — Basic Info */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[9px] font-bold">1</span>
                Basic Information
              </p>
              <div>
                <label className={labelCls}>Job Title *</label>
                <input type="text" value={form.title} onChange={e => set('title', e.target.value)} className={inputCls} placeholder="e.g. Senior React Developer" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Department</label>
                  <select value={form.department} onChange={e => { set('department', e.target.value); if (e.target.value !== 'Other') set('customDepartment', ''); }} className={selectCls}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                  <AnimatePresence>
                    {form.department === 'Other' && (
                      <motion.input initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 8 }} exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        type="text" placeholder="Enter department name" value={form.customDepartment} onChange={e => set('customDepartment', e.target.value)} className={inputCls} />
                    )}
                  </AnimatePresence>
                </div>
                {/* Location with autocomplete */}
                <div ref={locRef} className="relative">
                  <label className={labelCls}>Location</label>
                  <div className="relative">
                    <input type="text" placeholder="e.g. Gurugram / Remote" value={form.location}
                      onChange={e => handleLocChange(e.target.value)}
                      onFocus={() => form.location.length >= 1 && locSugg.length > 0 && setShowLocDrop(true)}
                      className={inputCls} autoComplete="off" />
                    {locLoading && <div className="absolute right-3 top-1/2 -translate-y-1/2"><Loader2 size={14} className="animate-spin text-purple-600"/></div>}
                  </div>
                  <AnimatePresence>
                    {showLocDrop && locSugg.length > 0 && (
                      <motion.ul initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                        className="absolute z-30 left-0 right-0 top-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto">
                        {locSugg.map(loc => (
                          <li key={loc}><button type="button" onMouseDown={() => { set('location', loc); setShowLocDrop(false); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-2">
                            <MapPin size={12} className="text-neutral-400 shrink-0"/>{loc}
                          </button></li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Employment Type</label>
                  <select value={form.employmentType} onChange={e => set('employmentType', e.target.value)} className={selectCls}>
                    {EMPLOYMENT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Work Mode</label>
                  <select value={form.workMode} onChange={e => set('workMode', e.target.value)} className={selectCls}>
                    {WORK_MODES.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Experience Level</label>
                  <select value={form.experience} onChange={e => set('experience', e.target.value)} className={selectCls}>
                    <option value="">Select level</option>
                    {EXPERIENCE_LEVELS.map(x => <option key={x}>{x}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Number of Openings</label>
                  <input type="number" min="1" value={form.openings} onChange={e => set('openings', e.target.value)} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Application Deadline</label>
                <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} className={inputCls} />
              </div>
            </div>

            {/* Section 2 — Compensation */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[9px] font-bold">2</span>
                Compensation <span className="text-neutral-400 normal-case font-normal">(optional)</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Min Salary (₹/month)</label>
                  <input type="number" placeholder="e.g. 50000" value={form.salaryMin} onChange={e => set('salaryMin', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Max Salary (₹/month)</label>
                  <input type="number" placeholder="e.g. 120000" value={form.salaryMax} onChange={e => set('salaryMax', e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>

            {/* Section 3 — Skills */}
            <div className="space-y-4" ref={skillRef}>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[9px] font-bold">3</span>
                Required Skills <span className="text-neutral-400 normal-case font-normal">(optional)</span>
              </p>
              <div className="relative">
                <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-neutral-200 bg-neutral-50 min-h-[52px] focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all cursor-text"
                  onClick={() => document.getElementById('company-skill-input')?.focus()}>
                  {form.skills.map(s => (
                    <span key={s} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-600 border border-purple-100">
                      {s}<button onClick={() => removeSkill(s)} className="hover:text-red-500 transition-colors"><X size={10}/></button>
                    </span>
                  ))}
                  <input id="company-skill-input" type="text" placeholder={form.skills.length === 0 ? 'Type or pick a skill...' : 'Add more...'}
                    value={form.skillInput} onChange={e => { set('skillInput', e.target.value); setShowSkillSugg(true); }}
                    onFocus={() => setShowSkillSugg(true)} onKeyDown={handleSkillKey}
                    className="flex-1 min-w-[140px] bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 outline-none" autoComplete="off"/>
                </div>
                <AnimatePresence>
                  {showSkillSugg && filteredSkills.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      className="absolute z-30 left-0 right-0 top-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-2xl p-3">
                      <p className="text-[10px] text-neutral-400 font-bold mb-2 uppercase tracking-wide">Suggestions</p>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                        {filteredSkills.map(s => (
                          <button key={s} type="button" onMouseDown={() => addSkill(s)}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-100 text-neutral-600 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                            + {s}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Section 4 — Job Description */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px] font-bold">4</span>
                Job Description
              </p>
              <textarea rows={5} value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="Describe the role, responsibilities, requirements..." className={`${inputCls} resize-none leading-relaxed`} />
              <p className="text-[10px] text-neutral-400 text-right">{form.description.length} characters</p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex gap-3 justify-end shrink-0">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors">Cancel</button>
            <button onClick={() => handleSubmit('Draft')} disabled={saving}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-neutral-700 border border-neutral-200 bg-white hover:bg-neutral-50 transition-all disabled:opacity-40 flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" />} Save as Draft
            </button>
            <button onClick={() => handleSubmit('Active')} disabled={saving}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all disabled:opacity-40 shadow-lg shadow-purple-600/20 flex items-center gap-2"
              style={{ background: '#8B3A8F' }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Publish Job
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Job Detail Full-Page Slide Panel ─────────────────────────────────────────
const JobDetailPanel = ({ job, onClose, onEdit }) => {
  if (!job) return null;

  const formatDate = (val) => {
    if (!val) return '—';
    const d = new Date(val);
    if (isNaN(d)) return '—';
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const salaryDisplay = () => {
    if (job.salaryMin && job.salaryMax) return `₹${Number(job.salaryMin).toLocaleString('en-IN')} – ₹${Number(job.salaryMax).toLocaleString('en-IN')} / month`;
    if (job.salaryMin) return `₹${Number(job.salaryMin).toLocaleString('en-IN')}+ / month`;
    return 'Not specified';
  };

  const InfoRow = ({ label, value }) => (
    <div>
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm text-neutral-800 font-medium">{value || '—'}</p>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-neutral-900/30 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Slide-in panel from right */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="absolute right-0 top-0 bottom-0 bg-white shadow-2xl flex flex-col"
          style={{ width: 'min(680px, 100vw)' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-8 py-5 border-b border-neutral-100 shrink-0">
            <div className="flex-1 min-w-0 pr-4">
              <h1 className="text-xl font-bold text-neutral-900 truncate">{job.title}</h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <StatusBadge status={job.status} />
                {job.department && (
                  <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md font-medium">{job.department}</span>
                )}
                {job.workMode && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-600">{job.workMode}</span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-3 divide-x divide-neutral-100 bg-neutral-50 border-b border-neutral-100 shrink-0">
            {[
              { label: 'Applicants', value: job.applicants ?? 0 },
              { label: 'Type', value: job.employmentType || job.type || '—' },
              { label: 'Status', value: job.status, color: '#8B3A8F' },
            ].map(({ label, value, color }) => (
              <div key={label} className="py-4 text-center">
                <p className="text-xl font-bold" style={color ? { color } : {}}>{value}</p>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-7">
            {/* Basic Info */}
            <section>
              <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Basic Information</h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <InfoRow label="Location" value={job.location} />
                <InfoRow label="Work Mode" value={job.workMode} />
                <InfoRow label="Department" value={job.department} />
                <InfoRow label="Employment Type" value={job.employmentType || job.type} />
                <InfoRow label="Posted Date" value={formatDate(job.postedDate || job.createdAt)} />
                <InfoRow label="Deadline" value={formatDate(job.deadline)} />
                <InfoRow label="Openings" value={job.openings ? `${job.openings} position${job.openings > 1 ? 's' : ''}` : null} />
              </div>
            </section>

            <div className="border-t border-neutral-100" />

            {/* Compensation */}
            <section>
              <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Compensation & Experience</h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <InfoRow label="Salary" value={salaryDisplay()} />
                <InfoRow label="Experience" value={job.experience} />
              </div>
            </section>

            <div className="border-t border-neutral-100" />

            {/* Description — preserve whitespace & line breaks */}
            <section>
              <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Job Description</h2>
              <div className="bg-neutral-50 rounded-xl border border-neutral-100 px-5 py-4 text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {job.description || '—'}
              </div>
            </section>

            {/* Skills */}
            {job.skills?.length > 0 && (
              <>
                <div className="border-t border-neutral-100" />
                <section>
                  <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Footer actions */}
          <div className="px-8 py-4 border-t border-neutral-100 bg-white flex gap-3 shrink-0">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
              Close
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => onEdit(job)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: '#8B3A8F' }}
            >
              Edit Job
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const ManageJobs = () => {
  const [jobsList, setJobsList] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewingJob, setViewingJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { jobs: jobsAPI } = await import('@/utils/api');
        const res = await jobsAPI.getMyJobs();
        const fetched = (res.data.jobs || []).map(j => ({
          id: j._id,
          title: j.title,
          department: j.department || '',
          description: j.description || '',
          salaryMin: j.salaryMin,
          salaryMax: j.salaryMax,
          salaryCurrency: j.salaryCurrency || 'INR',
          experience: j.experience || '',
          location: j.location || '',
          employmentType: j.employmentType || 'Full-time',
          type: j.employmentType || 'Full-time',   // alias for legacy UI
          workMode: j.workMode || '',
          skills: j.skills || [],
          deadline: j.deadline || null,
          openings: j.openings || 1,
          status: j.status || 'Active',
          postedDate: j.createdAt,
          applicants: j.applicationCount || 0,
        }));
        setJobsList(fetched);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        const saved = localStorage.getItem('hz_posted_jobs');
        setJobsList(saved ? JSON.parse(saved) : MOCK_JOBS);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filtered = jobsList.filter(j => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      (j.department || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAction = async (id, action) => {
    try {
      const { jobs: jobsAPI } = await import('@/utils/api');
      if (action === 'delete') {
        await jobsAPI.delete(id);
        setJobsList(prev => prev.filter(j => j.id !== id));
        toast.success('Job deleted');
      } else if (action === 'toggle') {
        const current = jobsList.find(j => j.id === id);
        const newStatus = current?.status === 'Active' ? 'Paused' : 'Active';
        await jobsAPI.update(id, { status: newStatus });
        setJobsList(prev => prev.map(j => j.id === id ? { ...j, status: newStatus } : j));
        toast.success(`Job ${newStatus === 'Active' ? 'resumed' : 'paused'}`);
      } else if (action === 'close') {
        await jobsAPI.update(id, { status: 'Closed' });
        setJobsList(prev => prev.map(j => j.id === id ? { ...j, status: 'Closed' } : j));
        toast.success('Job closed');
      }
    } catch (error) {
      console.error('Action failed:', error);
      toast.error('Failed to perform action');
    }
  };

  const handleSaveJob = async (updated) => {
    try {
      const { jobs: jobsAPI } = await import('@/utils/api');
      await jobsAPI.update(updated.id, {
        title: updated.title,
        department: updated.department,
        description: updated.description,
        salaryMin: updated.salaryMin,
        salaryMax: updated.salaryMax,
        experience: updated.experience,
        location: updated.location,
        employmentType: updated.employmentType,
        workMode: updated.workMode,
        skills: updated.skills,
        deadline: updated.deadline,
        openings: updated.openings,
      });
      setJobsList(prev => prev.map(j => j.id === updated.id ? { ...j, ...updated, type: updated.employmentType } : j));
      setEditingJob(null);
      toast.success('Job updated successfully');
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update job');
    }
  };

  const counts = {
    All:    jobsList.length,
    Active: jobsList.filter(j => j.status === 'Active').length,
    Draft:  jobsList.filter(j => j.status === 'Draft').length,
    Paused: jobsList.filter(j => j.status === 'Paused').length,
    Closed: jobsList.filter(j => j.status === 'Closed').length,
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-6">
          <SectionHeader title="Manage Jobs" subtitle="View, edit, and manage all your job postings." />
          <Link
            to="/hire-zone/post-job"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 shadow-sm"
            style={{ background: '#8B3A8F' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Post Job
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-xl px-4 py-2.5 flex-1 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-neutral-400 shrink-0">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search by title or department..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-neutral-700 placeholder-neutral-400 outline-none flex-1"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-neutral-400 hover:text-neutral-600">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 bg-neutral-100 rounded-xl p-1">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === s ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {s} <span className="ml-0.5 opacity-60">({counts[s]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth="3"/>
              <path d="M12 2a10 10 0 0110 10" stroke="#8B3A8F" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <EmptyState title="No jobs found" message="Try adjusting your search or filter." />
            ) : (
              <div className="space-y-3">
                {filtered.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onAction={handleAction}
                    onView={(j) => setViewingJob(j)}
                    onEdit={(j) => setEditingJob(j)}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        )}

        {filtered.length > 0 && (
          <p className="text-xs text-neutral-400 text-center mt-4">
            Showing {filtered.length} of {jobsList.length} jobs
          </p>
        )}
      </motion.div>

      {/* Full-page slide panel for viewing */}
      {viewingJob && (
        <JobDetailPanel
          job={viewingJob}
          onClose={() => setViewingJob(null)}
          onEdit={(job) => { setViewingJob(null); setEditingJob(job); }}
        />
      )}

      {/* Edit modal */}
      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={handleSaveJob}
        />
      )}
    </div>
  );
};

export default ManageJobs;
