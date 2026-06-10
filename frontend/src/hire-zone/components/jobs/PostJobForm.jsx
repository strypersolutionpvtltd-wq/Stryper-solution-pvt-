import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REQUIRED = ['title', 'department', 'location', 'employmentType', 'experienceLevel', 'description'];

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const EXPERIENCE_LEVELS = ['0-1 yr', '1-3 yrs', '3-5 yrs', '5-8 yrs', '8+ yrs'];
const DEPARTMENTS = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Operations', 'Analytics', 'Customer Support', 'Other'];

const LOCATION_SUGGESTIONS = [
  'Remote', 'Hybrid', 'Work From Home',
];

const SKILL_SUGGESTIONS = [
  // Frontend
  'React.js', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'JavaScript', 'TypeScript',
  'HTML', 'CSS', 'SASS', 'LESS', 'Tailwind CSS', 'Bootstrap', 'Material UI',
  'Redux', 'Zustand', 'React Query', 'Webpack', 'Vite', 'Babel',
  'Web Development', 'Frontend Development', 'Responsive Design',

  // Backend
  'Node.js', 'Express.js', 'NestJS', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
  'Laravel', 'Ruby on Rails', 'ASP.NET', 'PHP', 'Go', 'Rust', 'Kotlin',
  'Backend Development', 'API Development', 'Server-Side Development',

  // Languages
  'Python', 'Java', 'C', 'C++', 'C#', 'Ruby', 'Swift', 'Dart', 'Scala', 'R',
  'MATLAB', 'Perl', 'Shell Scripting', 'Bash', 'PowerShell',

  // Mobile
  'React Native', 'Flutter', 'Android Development', 'iOS Development',
  'Mobile Development', 'Ionic', 'Xamarin', 'Mobile App Development',

  // Database
  'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Cassandra', 'DynamoDB',
  'Firebase', 'Supabase', 'Oracle DB', 'MS SQL Server', 'Elasticsearch',
  'Database Management', 'Database Design',

  // Cloud & DevOps
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Ansible',
  'Jenkins', 'GitHub Actions', 'CI/CD', 'Linux', 'Nginx', 'Apache',
  'Serverless', 'Microservices', 'Helm', 'DevOps', 'Cloud Computing',
  'Site Reliability Engineering', 'SRE',

  // AI / ML / Data
  'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'TensorFlow',
  'PyTorch', 'Scikit-learn', 'Keras', 'Pandas', 'NumPy', 'OpenCV',
  'Data Analysis', 'Data Science', 'Data Engineering', 'ETL', 'Apache Spark',
  'Hadoop', 'Power BI', 'Tableau', 'Looker', 'Excel', 'SQL',
  'Artificial Intelligence', 'AI', 'ML', 'Business Intelligence',
  'Data Visualization', 'Statistical Analysis', 'Big Data',

  // APIs & Architecture
  'REST APIs', 'GraphQL', 'gRPC', 'WebSockets', 'OAuth', 'JWT',
  'Microservices Architecture', 'System Design', 'API Design',
  'Software Architecture', 'Full Stack Development', 'Fullstack Development',

  // Testing & QA
  'Jest', 'Cypress', 'Selenium', 'Playwright', 'Mocha', 'Chai',
  'Unit Testing', 'Integration Testing', 'TDD', 'BDD', 'QA Testing',
  'Manual Testing', 'Automation Testing', 'Performance Testing',
  'Quality Assurance', 'Software Testing',

  // Security
  'Cybersecurity', 'Network Security', 'Penetration Testing', 'Ethical Hacking',
  'Information Security', 'VAPT', 'OWASP', 'Security Auditing',

  // Design & UX
  'Figma', 'Adobe XD', 'Sketch', 'UI/UX Design', 'Wireframing', 'Prototyping',
  'User Research', 'Design Systems', 'Responsive Design', 'Accessibility',
  'Graphic Design', 'Adobe Photoshop', 'Adobe Illustrator', 'Canva',
  'Motion Design', 'Video Editing', 'After Effects', 'Premiere Pro',
  'UI Design', 'UX Design', 'Product Design', 'Visual Design',

  // Version Control & Tools
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence', 'Notion',
  'Postman', 'VS Code', 'IntelliJ IDEA', 'Slack', 'Trello', 'Asana',

  // Marketing & Sales
  'SEO', 'SEM', 'Google Ads', 'Meta Ads', 'Content Marketing', 'Email Marketing',
  'Copywriting', 'Social Media Marketing', 'HubSpot', 'Salesforce', 'CRM',
  'Lead Generation', 'Performance Marketing', 'Brand Management',
  'Digital Marketing', 'Affiliate Marketing', 'Influencer Marketing',
  'Content Writing', 'Blog Writing', 'Technical Writing',
  'Market Research', 'Growth Hacking', 'Product Marketing',

  // Finance & Accounting
  'Financial Analysis', 'Accounting', 'Tally', 'QuickBooks', 'SAP',
  'Budgeting', 'Forecasting', 'Taxation', 'Auditing', 'MS Excel',
  'Financial Modeling', 'Investment Analysis', 'Risk Management',
  'GST', 'Bookkeeping', 'Cost Accounting',

  // HR & Operations
  'Recruitment', 'Talent Acquisition', 'HR Management', 'Payroll',
  'Performance Management', 'Employee Relations', 'Training & Development',
  'Operations Management', 'Supply Chain', 'Logistics',
  'Human Resources', 'Onboarding', 'HRMS', 'Workforce Planning',

  // Healthcare
  'Clinical Research', 'Medical Coding', 'Healthcare Management',
  'Nursing', 'Pharmacy', 'Radiology', 'Physiotherapy',

  // Education
  'Teaching', 'Curriculum Development', 'E-Learning', 'Instructional Design',
  'Training', 'Coaching', 'Mentoring',

  // Soft Skills
  'Project Management', 'Agile', 'Scrum', 'Kanban', 'Leadership',
  'Team Management', 'Communication', 'Problem Solving', 'Critical Thinking',
  'Time Management', 'Stakeholder Management', 'Presentation Skills',
  'Negotiation', 'Conflict Resolution', 'Decision Making', 'Adaptability',
  'Emotional Intelligence', 'Customer Service', 'Client Management',
];

const INITIAL = {
  title: '', department: '', customDepartment: '', location: '', employmentType: '',
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

  // Location autocomplete
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationDrop, setShowLocationDrop] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const locationRef = useRef(null);
  const locationDebounce = useRef(null);

  // Skill suggestions
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const skillRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) setShowLocationDrop(false);
      if (skillRef.current && !skillRef.current.contains(e.target)) setShowSkillSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }));
  };

  // Location input handler — Nominatim API with debounce
  const handleLocationChange = (val) => {
    set('location', val);
    setShowLocationDrop(false);

    if (locationDebounce.current) clearTimeout(locationDebounce.current);

    const trimmed = val.trim();

    // Show static options immediately for short/empty input
    if (trimmed.length === 0) {
      setLocationSuggestions([]);
      return;
    }

    // Check static options first
    const staticMatches = LOCATION_SUGGESTIONS.filter(l =>
      l.toLowerCase().includes(trimmed.toLowerCase())
    );

    if (trimmed.length < 2) {
      setLocationSuggestions(staticMatches);
      setShowLocationDrop(staticMatches.length > 0);
      return;
    }

    // Debounce API call by 350ms
    locationDebounce.current = setTimeout(async () => {
      setLocationLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmed)}&countrycodes=in&format=json&addressdetails=1&limit=8`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();

        // Format: "City, State" or "City, District, State"
        const apiResults = data
          .filter(item => item.address)
          .map(item => {
            const a = item.address;
            const city = a.city || a.town || a.village || a.county || a.state_district || '';
            const state = a.state || '';
            if (city && state) return `${city}, ${state}`;
            if (state) return state;
            return item.display_name.split(',').slice(0, 2).join(',').trim();
          })
          .filter(Boolean)
          // Remove duplicates
          .filter((v, i, arr) => arr.indexOf(v) === i)
          .slice(0, 6);

        const combined = [...staticMatches, ...apiResults.filter(r => !staticMatches.includes(r))];
        setLocationSuggestions(combined.slice(0, 8));
        setShowLocationDrop(combined.length > 0);
      } catch {
        // Fallback to static on network error
        setLocationSuggestions(staticMatches);
        setShowLocationDrop(staticMatches.length > 0);
      } finally {
        setLocationLoading(false);
      }
    }, 350);
  };

  // Filtered skill suggestions — fuzzy match ignoring spaces and case
  const normalise = (s) => s.toLowerCase().replace(/[\s\-_.]/g, '');
  const filteredSkills = skillInput.trim().length > 0
    ? SKILL_SUGGESTIONS.filter(s =>
        normalise(s).includes(normalise(skillInput)) && !form.skills.includes(s)
      ).slice(0, 10)
    : SKILL_SUGGESTIONS.filter(s => !form.skills.includes(s)).slice(0, 12);

  const addSkill = (skill) => {
    const tag = skill.trim().replace(/,$/, '');
    if (tag && !form.skills.includes(tag)) set('skills', [...form.skills, tag]);
    setSkillInput('');
    setShowSkillSuggestions(false);
    document.getElementById('skill-input')?.focus();
  };

  const handleSkillKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      addSkill(skillInput);
    }
    if (e.key === 'Escape') setShowSkillSuggestions(false);
  };

  const removeSkill = (s) => set('skills', form.skills.filter(x => x !== s));

  const validate = () => {
    const errs = {};
    REQUIRED.forEach(k => {
      if (!form[k] || !form[k].toString().trim()) errs[k] = 'This field is required';
    });
    if (form.department === 'Other' && !form.customDepartment.trim()) {
      errs.customDepartment = 'Please specify the department';
    }
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
            <FormField label="Department" required error={errors.department || errors.customDepartment}>
              <select
                value={form.department}
                onChange={e => { set('department', e.target.value); if (e.target.value !== 'Other') set('customDepartment', ''); }}
                className={inputCls(errors.department)}
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
              <AnimatePresence>
                {form.department === 'Other' && (
                  <motion.input
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    type="text"
                    placeholder="Enter department name"
                    value={form.customDepartment}
                    onChange={e => set('customDepartment', e.target.value)}
                    className={inputCls(errors.customDepartment)}
                  />
                )}
              </AnimatePresence>
            </FormField>
          </div>

          <div data-error={!!errors.location} ref={locationRef} className="relative">
            <FormField label="Location" required error={errors.location}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Gurugram / Remote"
                  value={form.location}
                  onChange={e => handleLocationChange(e.target.value)}
                  onFocus={() => form.location.trim().length >= 2 && setShowLocationDrop(locationSuggestions.length > 0)}
                  className={inputCls(errors.location)}
                  autoComplete="off"
                />
                {locationLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#8B3A8F" strokeWidth="3" strokeOpacity="0.25"/>
                      <path d="M12 2a10 10 0 0110 10" stroke="#8B3A8F" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
              </div>
            </FormField>
            <AnimatePresence>
              {showLocationDrop && (
                <motion.ul
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden"
                >
                  {locationSuggestions.map(loc => (
                    <li key={loc}>
                      <button
                        type="button"
                        onMouseDown={() => { set('location', loc); setShowLocationDrop(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-2"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-neutral-400 shrink-0">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        {loc}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
        <div ref={skillRef} className="relative">
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
              placeholder={form.skills.length === 0 ? 'Type or pick a skill below...' : 'Add more...'}
              value={skillInput}
              onChange={e => { setSkillInput(e.target.value); setShowSkillSuggestions(true); }}
              onFocus={() => setShowSkillSuggestions(true)}
              onKeyDown={handleSkillKeyDown}
              className="flex-1 min-w-[140px] bg-transparent text-sm text-neutral-700 placeholder-neutral-400 outline-none"
              autoComplete="off"
            />
          </div>
          <AnimatePresence>
            {showSkillSuggestions && filteredSkills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg p-3"
              >
                <p className="text-[10px] text-neutral-400 font-medium mb-2 uppercase tracking-wide">Suggestions</p>
                <div className="flex flex-wrap gap-1.5">
                  {filteredSkills.map(s => (
                    <button
                      key={s} type="button"
                      onMouseDown={() => addSkill(s)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-100 text-neutral-700 hover:bg-purple-100 hover:text-purple-700 transition-colors"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
