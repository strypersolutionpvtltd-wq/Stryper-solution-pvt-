import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { candidateProfile, candidateExperience, candidateEducation } from '@/utils/api';
import toast from 'react-hot-toast';

const inputCls = 'w-full px-4 py-2 rounded-xl border border-neutral-200 text-sm text-neutral-800 focus:outline-none focus:border-purple-400 transition-all';

const Section = ({ title, action, children }) => (
  <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 mb-4">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold text-neutral-800">{title}</h2>
      {action}
    </div>
    {children}
  </div>
);

// Suggestion dropdown input
const SuggestInput = ({ value, onChange, placeholder, options, className }) => {
  const [show, setShow] = useState(false);
  const filtered = options.filter(o => o.toLowerCase().includes((value || '').toLowerCase()) && o !== value);
  return (
    <div className="relative">
      <input
        value={value || ''}
        onChange={e => { onChange(e.target.value); setShow(true); }}
        onFocus={() => setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 150)}
        placeholder={placeholder}
        className={className || inputCls}
      />
      {show && filtered.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg max-h-44 overflow-y-auto">
          {filtered.slice(0, 6).map(o => (
            <li key={o} onMouseDown={() => { onChange(o); setShow(false); }}
              className="px-4 py-2 text-sm text-neutral-700 hover:bg-purple-50 cursor-pointer">{o}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

const EXPERIENCE_OPTIONS = ['Fresher','Less than 1 year','1 year','2 years','3 years','4 years','5 years','6 years','7 years','8 years','10+ years','15+ years'];
const SALARY_OPTIONS = ['Below ₹3 LPA','₹3–5 LPA','₹5–8 LPA','₹8–12 LPA','₹12–18 LPA','₹18–25 LPA','₹25–35 LPA','₹35–50 LPA','₹50+ LPA'];
const NOTICE_OPTIONS = ['Immediate','15 days','1 month','2 months','3 months'];
const EMP_OPTIONS = ['Full-time','Part-time','Contract','Freelance','Internship'];
const ROLE_OPTIONS = ['Frontend Developer','Backend Developer','Full Stack Developer','React Developer','Node.js Developer','UI/UX Designer','DevOps Engineer','Data Analyst','Product Manager','Mobile Developer','QA Engineer','Java Developer','Python Developer'];
const LOCATION_OPTIONS = ['Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Pune','Noida','Gurgaon','Kolkata','Remote','Pan India'];

const EMPTY_FORM = {
  fullName: '', title: '', email: '', phone: '', location: '', summary: '', skills: [],
  careerDetails: { preferredRole: '', experience: '', salaryExpectation: '', locationPreference: '', employmentType: '', noticePeriod: '' },
};
const EMPTY_EXP = { jobTitle: '', company: '', location: '', startDate: '', endDate: '', currentlyWorking: false, employmentType: 'Full-time', description: '' };
const EMPTY_EDU = { school: '', degree: '', field: '', startYear: '', endYear: '', grade: '', description: '' };

export default function Profile() {
  const { userData, updateUserData } = useAuth();
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  // separate edit states per section
  const [editHeader, setEditHeader]   = useState(false);
  const [editCareer, setEditCareer]   = useState(false);
  const [editSkills, setEditSkills]   = useState(false);

  const [form, setForm]               = useState({ ...EMPTY_FORM, email: userData?.email || '' });
  const [savedForm, setSavedForm]     = useState(null);
  const [experience, setExperience]   = useState([]);
  const [education, setEducation]     = useState([]);
  const [openExp, setOpenExp]         = useState(null);
  const [openEdu, setOpenEdu]         = useState(null);
  const [newSkill, setNewSkill]       = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [pRes, eRes, edRes] = await Promise.all([
          candidateProfile.get(),
          candidateExperience.getAll(),
          candidateEducation.getAll(),
        ]);
        if (pRes.data?.profile) {
          const p = pRes.data.profile;
          const fullName = `${p.firstName || ''} ${p.lastName || ''}`.trim();
          setProfileExists(true);
          const loaded = {
            ...EMPTY_FORM,
            fullName, email: userData?.email || '',
            location: p.location || '', phone: p.phone || '',
            title: p.headline || '', summary: p.bio || '',
            skills: (p.skills || []).map(s => ({ name: s })),
            careerDetails: {
              preferredRole:      p.preferredJobTitle || '',
              experience:         '',
              salaryExpectation:  p.preferredSalary?.min ? `₹${p.preferredSalary.min}–${p.preferredSalary.max} LPA` : '',
              locationPreference: p.preferredLocation || '',
              employmentType:     (p.employmentType || [])[0] || '',
              noticePeriod:       p.noticePeriod || '',
            },
          };
          setForm(loaded);
          setSavedForm(loaded);
          if (fullName) updateUserData({ fullName });
        } else {
          const init = { ...EMPTY_FORM, email: userData?.email || '' };
          setForm(init); setSavedForm(init);
        }
        setExperience(eRes.data?.experiences || []);
        setEducation(edRes.data?.education || []);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setCD = (key, val) => setForm(p => ({ ...p, careerDetails: { ...p.careerDetails, [key]: val } }));

  const saveSection = async (section) => {
    setSaving(true);
    try {
      const [first, ...rest] = (form.fullName || '').trim().split(' ');
      const payload = {
        firstName:         first || 'User',
        lastName:          rest.join(' ') || 'Name',
        headline:          form.title || '',
        bio:               form.summary || '',
        location:          form.location || '',
        phone:             form.phone || '',
        skills:            form.skills.map(s => s.name),
        preferredJobTitle: form.careerDetails?.preferredRole || '',
        preferredLocation: form.careerDetails?.locationPreference || '',
        noticePeriod:      form.careerDetails?.noticePeriod || 'Immediate',
        employmentType:    form.careerDetails?.employmentType ? [form.careerDetails.employmentType] : [],
      };
      if (profileExists) {
        await candidateProfile.update(payload);
      } else {
        await candidateProfile.create(payload);
        setProfileExists(true);
      }
      if (form.fullName) updateUserData({ fullName: form.fullName });
      setSavedForm(form);
      toast.success('Saved!');
      if (section === 'header') setEditHeader(false);
      if (section === 'career') setEditCareer(false);
      if (section === 'skills') setEditSkills(false);
    } catch (err) {
      console.error('Save error:', err?.response?.data);
      toast.error(err?.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const cancelSection = (section) => {
    if (savedForm) setForm(savedForm);
    if (section === 'header') setEditHeader(false);
    if (section === 'career') setEditCareer(false);
    if (section === 'skills') setEditSkills(false);
  };

  // ── Experience ──────────────────────────────────────────
  const addExp = () => { setExperience(p => [...p, { ...EMPTY_EXP }]); setOpenExp(experience.length); };

  const saveExp = async (idx) => {
    const exp = experience[idx];
    if (!exp.jobTitle?.trim() || !exp.company?.trim()) { toast.error('Job title and company are required'); return; }
    if (!exp.startDate) { toast.error('Start date is required'); return; }
    try {
      const payload = {
        jobTitle: exp.jobTitle.trim(), company: exp.company.trim(),
        location: exp.location || '', startDate: exp.startDate,
        endDate: (!exp.currentlyWorking && exp.endDate) ? exp.endDate : null,
        currentlyWorking: !!exp.currentlyWorking,
        employmentType: exp.employmentType || 'Full-time',
        description: exp.description || '',
      };
      if (exp._id) {
        const res = await candidateExperience.update(exp._id, payload);
        setExperience(p => p.map((e, i) => i === idx ? res.data.experience : e));
      } else {
        const res = await candidateExperience.add(payload);
        setExperience(p => p.map((e, i) => i === idx ? res.data.experience : e));
      }
      setOpenExp(null); toast.success('Experience saved!');
    } catch (err) {
      console.error('Exp error:', err?.response?.data);
      toast.error(err?.response?.data?.message || 'Failed to save experience');
    }
  };

  const deleteExp = async (idx) => {
    const exp = experience[idx];
    try {
      if (exp._id) await candidateExperience.delete(exp._id);
      setExperience(p => p.filter((_, i) => i !== idx));
      setOpenExp(null); toast.success('Removed');
    } catch { toast.error('Failed to delete'); }
  };

  // ── Education ───────────────────────────────────────────
  const addEdu = () => { setEducation(p => [...p, { ...EMPTY_EDU }]); setOpenEdu(education.length); };

  const saveEdu = async (idx) => {
    const edu = education[idx];
    if (!edu.school?.trim() || !edu.degree?.trim() || !edu.field?.trim()) { toast.error('School, degree and field are required'); return; }
    if (!edu.startYear) { toast.error('Start year is required'); return; }
    try {
      const payload = {
        school: edu.school.trim(), degree: edu.degree.trim(), field: edu.field.trim(),
        startYear: parseInt(edu.startYear), endYear: edu.endYear ? parseInt(edu.endYear) : null,
        grade: edu.grade || '', description: edu.description || '',
      };
      if (edu._id) {
        const res = await candidateEducation.update(edu._id, payload);
        setEducation(p => p.map((e, i) => i === idx ? res.data.education : e));
      } else {
        const res = await candidateEducation.add(payload);
        setEducation(p => p.map((e, i) => i === idx ? res.data.education : e));
      }
      setOpenEdu(null); toast.success('Education saved!');
    } catch (err) {
      console.error('Edu error:', err?.response?.data);
      toast.error(err?.response?.data?.message || 'Failed to save education');
    }
  };

  const deleteEdu = async (idx) => {
    const edu = education[idx];
    try {
      if (edu._id) await candidateEducation.delete(edu._id);
      setEducation(p => p.filter((_, i) => i !== idx));
      setOpenEdu(null); toast.success('Removed');
    } catch { toast.error('Failed to delete'); }
  };

  const initials = form.fullName
    ? form.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (userData?.email?.[0] || 'U').toUpperCase();

  const EditActions = ({ section }) => (
    <div className="flex gap-2">
      <button onClick={() => cancelSection(section)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-200 text-neutral-500 hover:bg-neutral-50">Cancel</button>
      <button onClick={() => saveSection(section)} disabled={saving}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 disabled:opacity-60"
        style={{ background: '#8B3A8F' }}>
        {saving && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
        Save
      </button>
    </div>
  );

  if (loading) return <div className="text-center py-12 text-neutral-400"><p className="text-sm">Loading profile...</p></div>;

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg,#8B3A8F,#6d2b70)' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              {editHeader ? (
                <div className="space-y-2">
                  <input value={form.fullName} onChange={e => setForm(p => ({...p, fullName: e.target.value}))} className={inputCls} placeholder="Full Name" />
                  <input value={form.title}    onChange={e => setForm(p => ({...p, title: e.target.value}))}    className={inputCls} placeholder="Headline / Job Title" />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={form.phone}    onChange={e => setForm(p => ({...p, phone: e.target.value}))}    className={inputCls} placeholder="Phone" />
                    <SuggestInput value={form.location} onChange={v => setForm(p => ({...p, location: v}))} placeholder="City" options={LOCATION_OPTIONS} />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-xl font-bold text-neutral-800 truncate">{form.fullName || userData?.email?.split('@')[0] || 'Your Name'}</h1>
                  <p className="text-sm text-neutral-500 mt-0.5 truncate">{form.title || 'Add your headline'}</p>
                  <p className="text-xs text-neutral-400 mt-1">{[form.location, form.email].filter(Boolean).join(' · ')}</p>
                </>
              )}
            </div>
          </div>
          <div className="shrink-0">
            {editHeader
              ? <EditActions section="header" />
              : <button onClick={() => { setSavedForm(form); setEditHeader(true); }} className="px-4 py-2 rounded-xl text-sm font-semibold border-2" style={{borderColor:'#8B3A8F',color:'#8B3A8F'}}>Edit Profile</button>
            }
          </div>
        </div>
        {editHeader ? (
          <textarea value={form.summary} onChange={e => setForm(p => ({...p, summary: e.target.value}))}
            className={`${inputCls} mt-4 h-24 resize-none`} placeholder="Professional summary..." />
        ) : (
          form.summary && <p className="text-sm text-neutral-600 mt-4 leading-relaxed border-t border-neutral-50 pt-4">{form.summary}</p>
        )}
      </div>

      {/* ── Career Details ──────────────────────────────────── */}
      <Section title="Career Details"
        action={editCareer
          ? <EditActions section="career" />
          : <button onClick={() => { setSavedForm(form); setEditCareer(true); }} className="px-3 py-1.5 rounded-lg text-xs font-semibold border-2" style={{borderColor:'#8B3A8F',color:'#8B3A8F'}}>Edit</button>
        }>
        {editCareer ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Preferred Role</label>
              <SuggestInput value={form.careerDetails?.preferredRole} onChange={v => setCD('preferredRole', v)} placeholder="e.g. React Developer" options={ROLE_OPTIONS} />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Experience</label>
              <SuggestInput value={form.careerDetails?.experience} onChange={v => setCD('experience', v)} placeholder="e.g. 3 years" options={EXPERIENCE_OPTIONS} />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Salary Expectation</label>
              <SuggestInput value={form.careerDetails?.salaryExpectation} onChange={v => setCD('salaryExpectation', v)} placeholder="e.g. ₹8–12 LPA" options={SALARY_OPTIONS} />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Location Preference</label>
              <SuggestInput value={form.careerDetails?.locationPreference} onChange={v => setCD('locationPreference', v)} placeholder="e.g. Bangalore, Remote" options={LOCATION_OPTIONS} />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Employment Type</label>
              <select value={form.careerDetails?.employmentType || ''} onChange={e => setCD('employmentType', e.target.value)} className={inputCls}>
                <option value="">Select type</option>
                {EMP_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Notice Period</label>
              <select value={form.careerDetails?.noticePeriod || ''} onChange={e => setCD('noticePeriod', e.target.value)} className={inputCls}>
                <option value="">Select period</option>
                {NOTICE_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ['Preferred Role',    form.careerDetails?.preferredRole],
              ['Experience',        form.careerDetails?.experience],
              ['Salary Expectation',form.careerDetails?.salaryExpectation],
              ['Location',          form.careerDetails?.locationPreference || form.location],
              ['Employment Type',   form.careerDetails?.employmentType],
              ['Notice Period',     form.careerDetails?.noticePeriod],
            ].map(([label, value]) => (
              <div key={label} className="bg-neutral-50 rounded-xl p-3">
                <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-sm font-semibold text-neutral-700 mt-0.5">{value || '—'}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── Skills ─────────────────────────────────────────── */}
      <Section title="Skills"
        action={editSkills
          ? <EditActions section="skills" />
          : <button onClick={() => { setSavedForm(form); setEditSkills(true); }} className="px-3 py-1.5 rounded-lg text-xs font-semibold border-2" style={{borderColor:'#8B3A8F',color:'#8B3A8F'}}>Edit</button>
        }>
        <div className="flex flex-wrap gap-2 mb-3">
          {form.skills.length > 0 ? form.skills.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border bg-purple-50 text-purple-700 border-purple-200">
              {s.name}
              {editSkills && (
                <button onClick={() => setForm(p => ({...p, skills: p.skills.filter((_,si) => si !== i)}))}
                  className="ml-1 text-purple-400 hover:text-red-500 text-base leading-none">×</button>
              )}
            </span>
          )) : <p className="text-sm text-neutral-400">No skills added yet.</p>}
        </div>
        {editSkills && (
          <div className="flex gap-2 mt-2">
            <input value={newSkill} onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && newSkill.trim()) { setForm(p => ({...p, skills: [...p.skills, {name: newSkill.trim()}]})); setNewSkill(''); e.preventDefault(); }}}
              className={`${inputCls} flex-1`} placeholder="Type skill + Enter to add" />
            <button onClick={() => { if (newSkill.trim()) { setForm(p => ({...p, skills: [...p.skills, {name: newSkill.trim()}]})); setNewSkill(''); }}}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{background:'#8B3A8F'}}>Add</button>
          </div>
        )}
      </Section>

      {/* ── Work Experience ─────────────────────────────────── */}
      <Section title="Work Experience">
        <div className="space-y-3">
          {experience.map((exp, idx) => (
            <div key={idx} className="border border-neutral-100 rounded-xl p-4">
              {openExp === idx ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-neutral-500 mb-1 block">Job Title *</label>
                      <SuggestInput value={exp.jobTitle||''} onChange={v => setExperience(p => p.map((x,i) => i===idx ? {...x, jobTitle:v} : x))} placeholder="e.g. Frontend Developer" options={ROLE_OPTIONS} />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-500 mb-1 block">Company *</label>
                      <input value={exp.company||''} onChange={e => setExperience(p => p.map((x,i) => i===idx ? {...x, company:e.target.value} : x))} className={inputCls} placeholder="Company name" />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-500 mb-1 block">Location</label>
                      <SuggestInput value={exp.location||''} onChange={v => setExperience(p => p.map((x,i) => i===idx ? {...x, location:v} : x))} placeholder="City" options={LOCATION_OPTIONS} />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-500 mb-1 block">Employment Type</label>
                      <select value={exp.employmentType||'Full-time'} onChange={e => setExperience(p => p.map((x,i) => i===idx ? {...x, employmentType:e.target.value} : x))} className={inputCls}>
                        {EMP_OPTIONS.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-neutral-500 mb-1 block">Start Date *</label>
                      <input type="date" value={exp.startDate||''} onChange={e => setExperience(p => p.map((x,i) => i===idx ? {...x, startDate:e.target.value} : x))} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-500 mb-1 block">End Date</label>
                      <input type="date" value={exp.endDate||''} disabled={exp.currentlyWorking} onChange={e => setExperience(p => p.map((x,i) => i===idx ? {...x, endDate:e.target.value} : x))} className={`${inputCls} disabled:opacity-50`} />
                      <label className="flex items-center gap-2 mt-1.5 text-xs text-neutral-500 cursor-pointer">
                        <input type="checkbox" checked={!!exp.currentlyWorking} onChange={e => setExperience(p => p.map((x,i) => i===idx ? {...x, currentlyWorking:e.target.checked, endDate:''} : x))} />
                        Currently working here
                      </label>
                    </div>
                  </div>
                  <textarea value={exp.description||''} onChange={e => setExperience(p => p.map((x,i) => i===idx ? {...x, description:e.target.value} : x))} className={`${inputCls} h-20 resize-none`} placeholder="Description (optional)" />
                  <div className="flex gap-2">
                    <button onClick={() => saveExp(idx)} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-100">Save</button>
                    <button onClick={() => { if (!experience[idx]._id) { setExperience(p => p.filter((_,i) => i !== idx)); } setOpenExp(null); }} className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-lg text-xs font-semibold hover:bg-neutral-200">Cancel</button>
                    <button onClick={() => deleteExp(idx)} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 ml-auto">Delete</button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 cursor-pointer group" onClick={() => setOpenExp(idx)}>
                  <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 group-hover:bg-purple-100">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="#8B3A8F" strokeWidth="1.8"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="#8B3A8F" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-800 text-sm">{exp.jobTitle || 'Untitled'}</p>
                    <p className="text-xs text-neutral-500">{exp.company}{exp.location ? ` · ${exp.location}` : ''} {exp.employmentType ? `· ${exp.employmentType}` : ''}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en',{month:'short',year:'numeric'}) : ''}
                      {exp.currentlyWorking ? ' – Present' : exp.endDate ? ` – ${new Date(exp.endDate).toLocaleDateString('en',{month:'short',year:'numeric'})}` : ''}
                    </p>
                    {exp.description && <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{exp.description}</p>}
                  </div>
                </div>
              )}
            </div>
          ))}
          <button onClick={addExp} className="w-full py-2 border-2 border-dashed border-neutral-200 rounded-xl text-sm font-semibold text-neutral-500 hover:border-purple-300 hover:text-purple-600 transition-colors">
            + Add Experience
          </button>
        </div>
      </Section>

      {/* ── Education ──────────────────────────────────────── */}
      <Section title="Education">
        <div className="space-y-3">
          {education.map((edu, idx) => (
            <div key={idx} className="border border-neutral-100 rounded-xl p-4">
              {openEdu === idx ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-neutral-500 mb-1 block">School / University *</label>
                      <input value={edu.school||''} onChange={e => setEducation(p => p.map((x,i) => i===idx ? {...x, school:e.target.value} : x))} className={inputCls} placeholder="e.g. Delhi University" />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-500 mb-1 block">Degree *</label>
                      <input value={edu.degree||''} onChange={e => setEducation(p => p.map((x,i) => i===idx ? {...x, degree:e.target.value} : x))} className={inputCls} placeholder="e.g. B.Tech, MBA" />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-500 mb-1 block">Field of Study *</label>
                      <input value={edu.field||''} onChange={e => setEducation(p => p.map((x,i) => i===idx ? {...x, field:e.target.value} : x))} className={inputCls} placeholder="e.g. Computer Science" />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-500 mb-1 block">Grade / CGPA</label>
                      <input value={edu.grade||''} onChange={e => setEducation(p => p.map((x,i) => i===idx ? {...x, grade:e.target.value} : x))} className={inputCls} placeholder="e.g. 8.5 CGPA" />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-500 mb-1 block">Start Year *</label>
                      <input type="number" value={edu.startYear||''} onChange={e => setEducation(p => p.map((x,i) => i===idx ? {...x, startYear:e.target.value} : x))} className={inputCls} placeholder="2018" min="1950" max="2030" />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-500 mb-1 block">End Year</label>
                      <input type="number" value={edu.endYear||''} onChange={e => setEducation(p => p.map((x,i) => i===idx ? {...x, endYear:e.target.value} : x))} className={inputCls} placeholder="2022" min="1950" max="2030" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => saveEdu(idx)} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100">Save</button>
                    <button onClick={() => { if (!education[idx]._id) { setEducation(p => p.filter((_,i) => i !== idx)); } setOpenEdu(null); }} className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-lg text-xs font-semibold hover:bg-neutral-200">Cancel</button>
                    <button onClick={() => deleteEdu(idx)} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 ml-auto">Delete</button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 cursor-pointer group" onClick={() => setOpenEdu(idx)}>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 12v5c3.33 2 8.67 2 12 0v-5" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-800 text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                    <p className="text-xs text-neutral-500">{edu.school}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{edu.startYear}{edu.endYear ? ` – ${edu.endYear}` : ''}{edu.grade ? ` · ${edu.grade}` : ''}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          <button onClick={addEdu} className="w-full py-2 border-2 border-dashed border-neutral-200 rounded-xl text-sm font-semibold text-neutral-500 hover:border-blue-300 hover:text-blue-600 transition-colors">
            + Add Education
          </button>
        </div>
      </Section>
    </div>
  );
}
