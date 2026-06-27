import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, MapPin, Users, IndianRupee, Trash2, Eye, X, Save, Loader2, Plus, Pencil } from 'lucide-react';
import { admin, jobs as jobsApi } from '@/utils/api';
import toast from 'react-hot-toast';

const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-purple-600/50 placeholder:text-neutral-600';
const selectCls = 'w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-purple-600/50';
const labelCls = 'text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1 block';

const DEPARTMENTS = ['Engineering','Design','Product','Marketing','Sales','Human Resources','Finance','Operations','Analytics','Customer Support','Other'];
const LOCATION_SUGG = ['Remote','Hybrid','Work From Home','Gurugram, Haryana','Noida, Uttar Pradesh','Bengaluru, Karnataka','Mumbai, Maharashtra','Hyderabad, Telangana','Pune, Maharashtra','Chennai, Tamil Nadu','Kolkata, West Bengal','Jaipur, Rajasthan','Ahmedabad, Gujarat','Delhi, Delhi'];
const SKILL_SUGG = ['React.js','Next.js','Vue.js','Angular','JavaScript','TypeScript','HTML','CSS','Tailwind CSS','Redux','Node.js','Express.js','NestJS','Django','Flask','FastAPI','Spring Boot','Laravel','PHP','Go','Python','Java','C','C++','C#','Ruby','Swift','Dart','Kotlin','React Native','Flutter','Android Development','iOS Development','MongoDB','PostgreSQL','MySQL','Redis','Firebase','Supabase','Elasticsearch','AWS','Azure','GCP','Docker','Kubernetes','Terraform','CI/CD','Linux','DevOps','Microservices','Machine Learning','Deep Learning','NLP','TensorFlow','PyTorch','Data Analysis','Data Science','SQL','Power BI','Tableau','REST APIs','GraphQL','System Design','Full Stack Development','Jest','Cypress','Selenium','Unit Testing','QA Testing','Automation Testing','Figma','Adobe XD','UI/UX Design','Wireframing','Prototyping','Git','GitHub','Jira','Postman','Agile','Scrum','Project Management','SEO','SEM','Google Ads','Content Marketing','Digital Marketing','Salesforce','CRM','Financial Analysis','Accounting','SAP','Tally','MS Excel','Budgeting','GST','Recruitment','HR Management','Payroll','Talent Acquisition','Leadership','Communication','Problem Solving','Time Management','Customer Service'];

const EMPTY = { title:'',department:'',customDepartment:'',location:'',employmentType:'',workMode:'',experience:'',openings:1,deadline:'',salaryMin:'',salaryMax:'',skills:[],skillInput:'',description:'',companyId:'',companySearch:'' };

const JobFormModal = ({ isOpen, onClose, onSave, isInternal, editJob, companies }) => {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [showCompDrop, setShowCompDrop] = useState(false);
  const [showLocDrop, setShowLocDrop] = useState(false);
  const [locSugg, setLocSugg] = useState([]);
  const [locLoading, setLocLoading] = useState(false);
  const [showSkillSugg, setShowSkillSugg] = useState(false);
  const locDebounce = useRef(null);
  const compRef = useRef(null);
  const locRef = useRef(null);
  const skillRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (compRef.current && !compRef.current.contains(e.target)) setShowCompDrop(false);
      if (locRef.current && !locRef.current.contains(e.target)) setShowLocDrop(false);
      if (skillRef.current && !skillRef.current.contains(e.target)) setShowSkillSugg(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    if (editJob) {
      const r = editJob.raw || {};
      setForm({
        title: r.title || '',
        department: DEPARTMENTS.includes(r.department) ? r.department : (r.department ? 'Other' : ''),
        customDepartment: DEPARTMENTS.includes(r.department) ? '' : (r.department || ''),
        location: r.location || '',
        employmentType: r.employmentType || '',
        workMode: r.workMode || '',
        experience: r.experience || '',
        openings: r.openings || 1,
        deadline: r.deadline ? r.deadline.split('T')[0] : '',
        salaryMin: r.salaryMin || '',
        salaryMax: r.salaryMax || '',
        skills: Array.isArray(r.skills) ? r.skills : [],
        skillInput: '',
        description: r.description || '',
        companyId: r.companyId?._id || r.companyId || '',
        companySearch: r.companyId?.companyName || '',
      });
    } else {
      setForm(EMPTY);
    }
  }, [isOpen, editJob]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const filteredComp = useMemo(() => {
    const q = form.companySearch.toLowerCase();
    return companies.filter(c => c.companyName.toLowerCase().includes(q)).slice(0, 10);
  }, [companies, form.companySearch]);

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
          return city && state ? `${city}, ${state}` : state || i.display_name.split(',').slice(0,2).join(',').trim();
        }).filter((v,i,arr) => v && arr.indexOf(v)===i).slice(0,6);
        const combined = [...staticM, ...api.filter(r => !staticM.includes(r))].slice(0,8);
        setLocSugg(combined); setShowLocDrop(combined.length > 0);
      } catch { setLocSugg(staticM); setShowLocDrop(staticM.length > 0); }
      finally { setLocLoading(false); }
    }, 350);
  };

  const norm = (s) => s.toLowerCase().replace(/[\s\-_.]/g, '');
  const filteredSkills = useMemo(() => {
    const q = form.skillInput.trim();
    if (!q) return SKILL_SUGG.filter(s => !form.skills.includes(s)).slice(0,12);
    return SKILL_SUGG.filter(s => norm(s).includes(norm(q)) && !form.skills.includes(s)).slice(0,10);
  }, [form.skillInput, form.skills]);

  const addSkill = (s) => {
    const tag = s.trim().replace(/,$/, '');
    if (tag && !form.skills.includes(tag)) set('skills', [...form.skills, tag]);
    set('skillInput', ''); setShowSkillSugg(false);
  };
  const removeSkill = (s) => set('skills', form.skills.filter(x => x !== s));
  const handleSkillKey = (e) => {
    if ((e.key==='Enter'||e.key===',') && form.skillInput.trim()) { e.preventDefault(); addSkill(form.skillInput); }
    if (e.key==='Escape') setShowSkillSugg(false);
  };

  const handleSubmit = async (status) => {
    if (!form.title.trim()) { toast.error('Job title is required'); return; }
    if (!isInternal && !editJob && !form.companyId) { toast.error('Please select a company'); return; }
    setSaving(true);
    try {
      await onSave({
        title: form.title,
        department: form.department === 'Other' ? form.customDepartment : form.department,
        location: form.location,
        employmentType: form.employmentType,
        workMode: form.workMode,
        experience: form.experience,
        openings: Number(form.openings) || 1,
        deadline: form.deadline || null,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
        skills: form.skills,
        description: form.description,
        status,
        isStryper: isInternal,
        companyId: form.companyId,
      });
      onClose();
    } catch { /* handled in parent */ }
    finally { setSaving(false); }
  };

  if (!isOpen) return null;
  const title = editJob ? `Edit â€” ${editJob.title}` : isInternal ? 'Add Internal Job' : 'Add External Job';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
          className="relative bg-[#0f0f0f] border border-white/10 rounded-[2rem] w-full max-w-2xl shadow-2xl text-white flex flex-col max-h-[90vh]">

          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
            <div>
              <h3 className="font-bold text-lg">{title}</h3>
              <p className="text-xs text-neutral-500 mt-0.5">{isInternal ? 'Internal Stryper job â€” shown on /careers page' : 'External job â€” shown to candidates on /jobs page'}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-neutral-400"><X size={20}/></button>
          </div>

          <div className="overflow-y-auto flex-1 p-6 space-y-6">

            {/* Company searchable dropdown â€” External only */}
            {!isInternal && !editJob && (
              <div className="bg-brand-purple-600/5 border border-brand-purple-600/20 rounded-2xl p-4" ref={compRef}>
                <label className={labelCls}>Company <span className="text-red-400">*</span></label>
                <div className="relative">
                  <input type="text" placeholder="Search company name..."
                    value={form.companySearch}
                    onChange={e => { set('companySearch', e.target.value); set('companyId', ''); setShowCompDrop(true); }}
                    onFocus={() => setShowCompDrop(true)}
                    className={inputCls} autoComplete="off" />
                  {form.companyId && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 text-[10px] font-bold">âœ“ Selected</span>}
                  <AnimatePresence>
                    {showCompDrop && filteredComp.length > 0 && (
                      <motion.ul initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}}
                        className="absolute z-30 left-0 right-0 top-full mt-1 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto">
                        {filteredComp.map(c => (
                          <li key={c._id}>
                            <button type="button" onMouseDown={() => { set('companyId', c._id); set('companySearch', c.companyName); setShowCompDrop(false); }}
                              className="w-full text-left px-4 py-3 text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between">
                              <span>{c.companyName}</span>
                              {c.industry && <span className="text-[10px] text-neutral-600">{c.industry}</span>}
                            </button>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Section 1 â€” Basic Info */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-purple-600/20 text-brand-purple-400 flex items-center justify-center text-[9px] font-bold">1</span>
                Basic Information
              </p>
              <div>
                <label className={labelCls}>Job Title <span className="text-red-400">*</span></label>
                <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Senior Frontend Developer" className={inputCls} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Department with Other input */}
                <div>
                  <label className={labelCls}>Department</label>
                  <select value={form.department} onChange={e => { set('department', e.target.value); if (e.target.value !== 'Other') set('customDepartment', ''); }} className={selectCls}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                  <AnimatePresence>
                    {form.department === 'Other' && (
                      <motion.input initial={{opacity:0,height:0,marginTop:0}} animate={{opacity:1,height:'auto',marginTop:8}} exit={{opacity:0,height:0,marginTop:0}}
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
                    {locLoading && <div className="absolute right-3 top-1/2 -translate-y-1/2"><Loader2 size={14} className="animate-spin text-brand-purple-400"/></div>}
                  </div>
                  <AnimatePresence>
                    {showLocDrop && locSugg.length > 0 && (
                      <motion.ul initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}}
                        className="absolute z-30 left-0 right-0 top-full mt-1 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                        {locSugg.map(loc => (
                          <li key={loc}><button type="button" onMouseDown={() => { set('location', loc); setShowLocDrop(false); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2">
                            <MapPin size={11} className="text-neutral-600 shrink-0"/>{loc}
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
                    <option value="">Select type</option>
                    {['Full-time','Part-time','Contract','Freelance','Internship'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Work Mode</label>
                  <select value={form.workMode} onChange={e => set('workMode', e.target.value)} className={selectCls}>
                    <option value="">Select work mode</option>
                    {['On-site','Remote','Hybrid'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Experience Level</label>
                  <select value={form.experience} onChange={e => set('experience', e.target.value)} className={selectCls}>
                    <option value="">Select level</option>
                    {['Fresher','0-1 yrs','1-3 yrs','3-5 yrs','5-8 yrs','8-10 yrs','10+ yrs'].map(x => <option key={x}>{x}</option>)}
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

            {/* Section 2 â€” Compensation */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-gold-500/20 text-brand-gold-500 flex items-center justify-center text-[9px] font-bold">2</span>
                Compensation <span className="text-neutral-600 normal-case font-normal">(optional)</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>Min Salary (â‚¹/month)</label><input type="number" value={form.salaryMin} onChange={e => set('salaryMin', e.target.value)} placeholder="e.g. 50000" className={inputCls}/></div>
                <div><label className={labelCls}>Max Salary (â‚¹/month)</label><input type="number" value={form.salaryMax} onChange={e => set('salaryMax', e.target.value)} placeholder="e.g. 120000" className={inputCls}/></div>
              </div>
            </div>

            {/* Section 3 â€” Skills */}
            <div className="space-y-4" ref={skillRef}>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[9px] font-bold">3</span>
                Required Skills <span className="text-neutral-600 normal-case font-normal">(optional)</span>
              </p>
              <div className="relative">
                <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-white/10 bg-white/5 min-h-[52px] focus-within:border-brand-purple-600/50 transition-all cursor-text"
                  onClick={() => document.getElementById('admin-skill-input')?.focus()}>
                  {form.skills.map(s => (
                    <span key={s} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-purple-600/20 text-brand-purple-400 border border-brand-purple-600/20">
                      {s}<button onClick={() => removeSkill(s)} className="hover:text-red-400 transition-colors"><X size={10}/></button>
                    </span>
                  ))}
                  <input id="admin-skill-input" type="text" placeholder={form.skills.length === 0 ? 'Type or pick a skill...' : 'Add more...'}
                    value={form.skillInput} onChange={e => { set('skillInput', e.target.value); setShowSkillSugg(true); }}
                    onFocus={() => setShowSkillSugg(true)} onKeyDown={handleSkillKey}
                    className="flex-1 min-w-[140px] bg-transparent text-sm text-white placeholder:text-neutral-600 outline-none" autoComplete="off"/>
                </div>
                <AnimatePresence>
                  {showSkillSugg && filteredSkills.length > 0 && (
                    <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}}
                      className="absolute z-30 left-0 right-0 top-full mt-1 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl p-3">
                      <p className="text-[10px] text-neutral-500 font-bold mb-2 uppercase tracking-wide">Suggestions</p>
                      <div className="flex flex-wrap gap-1.5">
                        {filteredSkills.map(s => (
                          <button key={s} type="button" onMouseDown={() => addSkill(s)}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 text-neutral-400 hover:bg-brand-purple-600/20 hover:text-brand-purple-400 transition-colors">
                            + {s}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Section 4 â€” Description */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[9px] font-bold">4</span>
                Job Description
              </p>
              <textarea rows={5} value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="Describe the role, responsibilities, requirements..." className={`${inputCls} resize-none leading-relaxed`}/>
              <p className="text-[10px] text-neutral-600 text-right">{form.description.length} characters</p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 bg-white/[0.02] border-t border-white/5 flex gap-3 justify-end shrink-0">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-neutral-500 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
            <button onClick={() => handleSubmit('Draft')} disabled={saving}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-neutral-300 border border-white/10 hover:bg-white/5 transition-all disabled:opacity-40 flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin"/>} Save as Draft
            </button>
            <button onClick={() => handleSubmit('Active')} disabled={saving}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-purple-600 hover:bg-brand-purple-700 transition-all disabled:opacity-40 shadow-lg shadow-brand-purple-600/20 flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin"/>}<Save size={14}/> Publish Job
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// â”€â”€ View Job Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ViewJobModal = ({ isOpen, onClose, job, onStatusChange }) => {
  const [updating, setUpdating] = useState(false);
  if (!isOpen || !job) return null;
  const raw = job.raw || {};
  const postedDate = raw.createdAt ? new Date(raw.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : 'N/A';
  const deadline = raw.deadline ? new Date(raw.deadline).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : 'Not set';
  const salary = raw.salaryMin && raw.salaryMax ? `â‚¹${(raw.salaryMin/100000).toFixed(1)}L â€“ â‚¹${(raw.salaryMax/100000).toFixed(1)}L` : 'Not disclosed';
  const statusColors = { Active:'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', Draft:'bg-neutral-500/10 text-neutral-400 border-neutral-500/20', Closed:'bg-red-500/10 text-red-400 border-red-500/20', Archived:'bg-amber-500/10 text-amber-400 border-amber-500/20' };
  const initials = (job.company||'SC').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm"/>
        <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:20}}
          className="relative bg-[#0f0f0f] border border-white/10 rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
          <div className="p-6 border-b border-white/5 flex items-start justify-between gap-4 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-purple-600/20 border border-brand-purple-600/30 flex items-center justify-center text-brand-purple-400 font-bold text-lg shrink-0">{initials}</div>
              <div>
                <h3 className="text-xl font-bold text-white leading-tight">{job.title}</h3>
                <p className="text-neutral-400 text-sm mt-0.5">{job.company}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {raw.workMode && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-purple-600/10 text-brand-purple-400 border border-brand-purple-600/20">{raw.workMode}</span>}
                  {raw.employmentType && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/10">{raw.employmentType}</span>}
                  {raw.department && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-gold-500/10 text-brand-gold-500 border border-brand-gold-500/20">{raw.department}</span>}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[job.status]||statusColors.Draft}`}>{job.status}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-neutral-400 hover:text-white shrink-0"><X size={20}/></button>
          </div>
          <div className="overflow-y-auto no-scrollbar flex-1 p-6 space-y-6">
            <div className="grid grid-cols-3 divide-x divide-white/5 bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
              {[{label:'Location',value:job.location||'N/A'},{label:'Salary',value:salary},{label:'Experience',value:raw.experience||'N/A'}].map((item,i)=>(
                <div key={i} className="p-4 text-center">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-sm font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Job Details</p>
              <div className="grid grid-cols-2 gap-3">
                {[{label:'Job Type',value:raw.employmentType||'N/A'},{label:'Work Mode',value:raw.workMode||'N/A'},{label:'Openings',value:raw.openings||1},{label:'Applicants',value:job.applicants},{label:'Posted',value:postedDate},{label:'Deadline',value:deadline}].map((item,i)=>(
                  <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-neutral-200">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            {raw.description && (
              <div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Job Description</p>
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                  <p className="text-sm text-neutral-400 leading-relaxed whitespace-pre-wrap">{raw.description}</p>
                </div>
              </div>
            )}
            {raw.skills?.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Required Skills</p>
                <div className="flex flex-wrap gap-2">
                  {raw.skills.map((s,i) => <span key={i} className="text-xs font-bold px-3 py-1.5 rounded-full bg-brand-purple-600/10 text-brand-purple-400 border border-brand-purple-600/20">{s}</span>)}
                </div>
              </div>
            )}
          </div>
          <div className="p-5 bg-white/[0.02] border-t border-white/5 shrink-0">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Change Status</p>
            <div className="flex items-center gap-2 flex-wrap">
              {['Active','Draft','Closed','Archived'].map(s => (
                <button key={s} onClick={async()=>{setUpdating(true);await onStatusChange(job.id,s);setUpdating(false);}}
                  disabled={job.status===s||updating}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${job.status===s?(statusColors[s]||'bg-white/10 text-white border-white/20')+' cursor-default':'bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10 hover:text-white'}`}>
                  {job.status===s?`â— ${s}`:s}
                </button>
              ))}
              <button onClick={onClose} className="ml-auto px-5 py-2 rounded-xl text-xs font-bold text-neutral-500 hover:text-white hover:bg-white/5 transition-colors border border-white/5">Close</button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('external');
  const [searchTerm, setSearchText] = useState('');
  const [modal, setModal] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [viewingJob, setViewingJob] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await admin.getAllJobs({ limit: 1000 });
      if (res.data?.success) {
        setJobs((res.data.jobs||[]).map(j => ({
          id: j._id, title: j.title,
          company: j.companyId?.companyName || 'Stryper Solution',
          location: j.location || 'Remote',
          applicants: j.applicationCount || 0,
          salary: j.salaryMin && j.salaryMax ? `â‚¹${(j.salaryMin/100000).toFixed(0)}L - â‚¹${(j.salaryMax/100000).toFixed(0)}L` : 'N/A',
          status: j.status || 'Active',
          isStryper: j.isStryper === true,
          raw: j,
        })));
      }
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  };

  const fetchCompanies = async () => {
    try {
      const res = await admin.getCompanyList();
      if (res.data?.success) setCompanies(res.data.companies || []);
    } catch {}
  };

  useEffect(() => { fetchJobs(); fetchCompanies(); }, []);

  const handleSaveJob = async (data) => {
    try {
      const payload = {
        title: data.title, description: data.description,
        employmentType: data.employmentType, location: data.location,
        experience: data.experience, skills: data.skills, status: data.status,
        department: data.department, workMode: data.workMode,
        salaryMin: data.salaryMin, salaryMax: data.salaryMax,
        openings: data.openings, deadline: data.deadline, isStryper: data.isStryper,
      };
      if (data.companyId) payload.companyId = data.companyId;
      let res;
      if (editingJob) { res = await jobsApi.update(editingJob.id, payload); }
      else { res = await jobsApi.create(payload); }
      if (res.data?.success) {
        toast.success(editingJob ? 'Job updated!' : `Job ${data.status==='Draft'?'saved as draft':'published'}!`);
        fetchJobs(); setEditingJob(null);
      } else { toast.error('Failed to save job'); throw new Error('failed'); }
    } catch (err) {
      if (err.message !== 'failed') toast.error(err.response?.data?.message || 'Server error');
      throw err;
    }
  };

  const handleDelete = async (id, title) => {
    try {
      const res = await jobsApi.delete(id);
      if (res.data?.success) { setJobs(j=>j.filter(x=>x.id!==id)); toast.success(`"${title}" removed.`); }
    } catch { toast.error('Failed to delete job'); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await jobsApi.update(id, { status: newStatus });
      if (res.data?.success) {
        setJobs(p=>p.map(j=>j.id===id?{...j,status:newStatus}:j));
        setViewingJob(p=>p?{...p,status:newStatus}:p);
        toast.success(`Status â†’ ${newStatus}`);
      }
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = useMemo(() => jobs.filter(j => {
    const matchSearch = (j.title?.toLowerCase()||'').includes(searchTerm.toLowerCase()) || (j.company?.toLowerCase()||'').includes(searchTerm.toLowerCase());
    const matchCat = activeCategory==='internal' ? j.isStryper===true : j.isStryper!==true;
    return matchSearch && matchCat;
  }), [jobs, searchTerm, activeCategory]);

  const statusColors = { Active:'bg-emerald-500/10 text-emerald-500', Paused:'bg-amber-500/10 text-amber-500', Draft:'bg-neutral-500/10 text-neutral-400', Closed:'bg-red-500/10 text-red-500', Archived:'bg-amber-500/10 text-amber-400' };

  return (
    <motion.div initial="hidden" animate="visible" variants={{visible:{transition:{staggerChildren:0.05}}}} className="space-y-6 pb-10 text-white">
      <JobFormModal
        isOpen={modal==='internal'||modal==='external'||modal==='edit'}
        onClose={() => { setModal(null); setEditingJob(null); }}
        onSave={handleSaveJob}
        isInternal={modal==='internal' || (modal==='edit' && editingJob?.isStryper===true)}
        editJob={modal==='edit' ? editingJob : null}
        companies={companies}
      />
      <ViewJobModal isOpen={!!viewingJob} job={viewingJob} onClose={()=>setViewingJob(null)} onStatusChange={handleStatusChange}/>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Job Moderation</h2>
          <p className="text-neutral-500 text-sm mt-1">Review and manage {jobs.length} job postings.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={()=>setModal('internal')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-purple-600 hover:bg-brand-purple-700 transition-all shadow-lg shadow-brand-purple-600/20">
            <Plus size={15}/> Add Internal Job
          </button>
          <button onClick={()=>setModal('external')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white border border-white/15 bg-white/5 hover:bg-white/10 transition-all">
            <Plus size={15}/> Add External Job
          </button>
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-neutral-500" size={16}/>
            <input type="text" placeholder="Search jobs..." value={searchTerm} onChange={e=>setSearchText(e.target.value)}
              className="bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple-600/50 w-full sm:w-56 text-white"/>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl w-fit border border-white/5">
        <button onClick={()=>setActiveCategory('external')}
          className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeCategory==='external'?'bg-[#8B3A8F] text-white shadow-lg':'text-neutral-500 hover:text-white hover:bg-white/5'}`}>
          External Jobs
        </button>
        <button onClick={()=>setActiveCategory('internal')}
          className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeCategory==='internal'?'bg-[#8B3A8F] text-white shadow-lg':'text-neutral-500 hover:text-white hover:bg-white/5'}`}>
          Internal Jobs
        </button>
      </div>

      {/* Table */}
      <motion.div variants={fadeInUp} className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Job Title & Company</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Applicants</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Salary Range</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={24} className="animate-spin text-brand-purple-500"/>
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Loading Jobs...</p>
                    </div>
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-20 text-center text-neutral-500 text-sm">
                    {searchTerm ? `No jobs matching "${searchTerm}"` : `No ${activeCategory} jobs yet.`}
                  </td></tr>
                ) : filtered.map(job => (
                  <motion.tr layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,scale:0.95}} key={job.id}
                    className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-gold-500/10 flex items-center justify-center text-brand-gold-500 border border-brand-gold-500/20"><Briefcase size={18}/></div>
                        <div>
                          <p className="text-sm font-bold text-white">{job.title}</p>
                          <p className="text-[11px] text-neutral-500 mt-0.5">{job.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="flex items-center gap-1.5 text-neutral-400 text-xs"><MapPin size={12}/>{job.location}</div></td>
                    <td className="px-6 py-4"><div className="flex items-center gap-1.5 text-neutral-400 text-xs"><Users size={12}/>{job.applicants} Applied</div></td>
                    <td className="px-6 py-4"><div className="flex items-center gap-1 text-emerald-500 text-xs font-bold"><IndianRupee size={12}/>{job.salary}</div></td>
                    <td className="px-6 py-4"><span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColors[job.status]||'bg-neutral-500/10 text-neutral-400'}`}>{job.status}</span></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={e=>{e.stopPropagation();setViewingJob(job);}} title="View" className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"><Eye size={16}/></button>
                        <button onClick={e=>{e.stopPropagation();setEditingJob(job);setModal('edit');}} title="Edit" className="p-2 rounded-lg hover:bg-brand-purple-600/10 text-neutral-400 hover:text-brand-purple-400 transition-colors"><Pencil size={15}/></button>
                        <button onClick={e=>{e.stopPropagation();handleDelete(job.id,job.title);}} title="Delete" className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminJobs;
