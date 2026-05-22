import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REQUIRED = ['title', 'department', 'location', 'employmentType', 'experienceLevel', 'description'];

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const EXPERIENCE_LEVELS = ['Entry Level (0-1 yr)', 'Junior (1-3 yrs)', 'Mid-level (3-5 yrs)', 'Senior (5-8 yrs)', 'Lead / Principal (8+ yrs)'];
const DEPARTMENTS = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Operations', 'Analytics', 'Customer Support'];

const INITIAL = {
  title: '', department: '', location: '', employmentType: '',
  experienceLevel: '', salaryMin: '', salaryMax: '',
  description: '', openings: '1', deadline: '', skills: [],
};

const FormField = ({ label, required, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="text-xs text-red-500 mt-1 flex items-center gap-1"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const inputCls = (err) =>
  `w-full px-4 py-2.5 rounded-xl border text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none transition-all ${
    err ? 'border-red-300 bg-red-50' : 'border-neutral-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100'
  }`;

const PostJobForm = () => {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [skillInput, setSkillInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }));
  };

  const addSkill = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      const tag = skillInput.trim().replace(/,$/, '');
      if (tag && !form.skills.includes(tag)) {
        set('skills', [...form.skills, tag]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (s) => set('skills', form.skills.filter(x => x !== s));

  const validate = () => {
    const errs = {};
    REQUIRED.forEach(k => {
      if (!form[k] || !form[k].toString().trim()) {
        errs[k] = 'This field is required';
      }
    });
    return errs;
  };

  const handleSubmit = (draft = false) => {
    if (draft) {
      setIsDraft(true);
      setSubmitted(true);
      return;
    }
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      // Scroll to first error
      const first = document.querySelector('[data-error="true"]');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setIsDraft(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm(INITIAL);
    setErrors({});
    setSubmitted(false);
    setSkillInput('');
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
          style={{ background: isDraft ? '#fef3c7' : '#dcfce7' }}>
          {isDraft ? (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          ) : (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </div>
        <h2 className="text-xl font-bold text-neutral-900 mb-2">
          {isDraft ? 'Draft Saved!' : 'Job Posted Successfully!'}
        </h2>
        <p className="text-neutral-500 text-sm mb-6 max-w-sm">
          {isDraft
            ? 'Your job draft has been saved. You can publish it anytime from Manage Jobs.'
            : `"${form.title}" is now live and accepting applications.`}
        </p>
        <button
          onClick={handleReset}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ background: '#8B3A8F' }}
        >
          Post Another Job
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section: Basic Info */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6">
        <h2 className="text-sm font-bold text-neutral-800 mb-5 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">1</span>
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2" data-error={!!errors.title}>
            <FormField label="Job Title" required error={errors.title}>
              <input
                type="text"
                placeholder="e.g. Senior Frontend Developer"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                className={inputCls(errors.title)}
              />
            </FormField>
          </div>

          <div data-error={!!errors.department}>
            <FormField label="Department" required error={errors.department}>
              <select value={form.department} onChange={e => set('department', e.target.value)} className={inputCls(errors.department)}>
                <option value="">Select department</option>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </FormField>
          </div>

          <div data-error={!!errors.location}>
            <FormField label="Location" required error={errors.location}>
              <input
                type="text"
                placeholder="e.g. Gurugram / Remote"
                value={form.location}
                onChange={e => set('location', e.target.value)}
                className={inputCls(errors.location)}
              />
            </FormField>
          </div>

          <div data-error={!!errors.employmentType}>
            <FormField label="Employment Type" required error={errors.employmentType}>
              <select value={form.employmentType} onChange={e => set('employmentType', e.target.value)} className={inputCls(errors.employmentType)}>
                <option value="">Select type</option>
                {EMPLOYMENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </FormField>
          </div>

          <div data-error={!!errors.experienceLevel}>
            <FormField label="Experience Level" required error={errors.experienceLevel}>
              <select value={form.experienceLevel} onChange={e => set('experienceLevel', e.target.value)} className={inputCls(errors.experienceLevel)}>
                <option value="">Select level</option>
                {EXPERIENCE_LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </FormField>
          </div>

          <FormField label="Number of Openings">
            <input
              type="number" min="1" max="99"
              value={form.openings}
              onChange={e => set('openings', e.target.value)}
              className={inputCls(false)}
            />
          </FormField>

          <FormField label="Application Deadline">
            <input
              type="date"
              value={form.deadline}
              onChange={e => set('deadline', e.target.value)}
              className={inputCls(false)}
            />
          </FormField>
        </div>
      </div>

      {/* Section: Compensation */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6">
        <h2 className="text-sm font-bold text-neutral-800 mb-5 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center">2</span>
          Compensation
          <span className="text-xs font-normal text-neutral-400 ml-1">(optional)</span>
        </h2>
        <div className="grid grid-cols-2 gap-5">
          <FormField label="Minimum Salary (₹/month)">
            <input
              type="number" placeholder="e.g. 50000"
              value={form.salaryMin}
              onChange={e => set('salaryMin', e.target.value)}
              className={inputCls(false)}
            />
          </FormField>
          <FormField label="Maximum Salary (₹/month)">
            <input
              type="number" placeholder="e.g. 120000"
              value={form.salaryMax}
              onChange={e => set('salaryMax', e.target.value)}
              className={inputCls(false)}
            />
          </FormField>
        </div>
      </div>

      {/* Section: Skills */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6">
        <h2 className="text-sm font-bold text-neutral-800 mb-5 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">3</span>
          Required Skills
          <span className="text-xs font-normal text-neutral-400 ml-1">(optional)</span>
        </h2>
        <div
          className="flex flex-wrap gap-2 p-3 rounded-xl border border-neutral-200 min-h-[52px] focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all cursor-text"
          onClick={() => document.getElementById('skill-input').focus()}
        >
          {form.skills.map(s => (
            <span key={s} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700">
              {s}
              <button onClick={() => removeSkill(s)} className="hover:text-red-500 transition-colors" aria-label={`Remove ${s}`}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </span>
          ))}
          <input
            id="skill-input"
            type="text"
            placeholder={form.skills.length === 0 ? 'Type a skill and press Enter (e.g. React, Node.js)' : 'Add more...'}
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={addSkill}
            className="flex-1 min-w-[160px] bg-transparent text-sm text-neutral-700 placeholder-neutral-400 outline-none"
          />
        </div>
      </div>

      {/* Section: Description */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6">
        <h2 className="text-sm font-bold text-neutral-800 mb-5 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center">4</span>
          Job Description
        </h2>
        <div data-error={!!errors.description}>
          <FormField label="Description" required error={errors.description}>
            <textarea
              rows={8}
              placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity exciting..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
              className={`${inputCls(errors.description)} resize-none leading-relaxed`}
            />
          </FormField>
        </div>
        <p className="text-xs text-neutral-400 mt-2">{form.description.length} characters</p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between gap-4 pb-2">
        <button
          onClick={() => handleSubmit(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all hover:bg-neutral-50"
          style={{ borderColor: '#8B3A8F', color: '#8B3A8F' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
          </svg>
          Save as Draft
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSubmit(false)}
          className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors shadow-md"
          style={{ background: 'linear-gradient(135deg, #8B3A8F, #6d2b71)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          Publish Job
        </motion.button>
      </div>
    </div>
  );
};

export default PostJobForm;
