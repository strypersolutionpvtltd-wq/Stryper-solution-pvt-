import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import SectionHeader from '@/hire-zone/components/shared/SectionHeader';
import ResumePreviewModal from '@/hire-zone/components/shared/ResumePreviewModal';
import { MOCK_APPLICANTS } from '@/hire-zone/data/mockApplicants';
import toast from 'react-hot-toast';

// ... RESUME_POOL remains the same
const RESUME_POOL = [
  ...MOCK_APPLICANTS,
  { id: 7,  name: 'Vikram Nair',    email: 'vikram@example.com',  phone: '+91 90000 11111', appliedRole: 'Product Manager',    experience: '6 years', location: 'Bangalore', stage: 'Applied', appliedDate: '2025-01-05', skills: ['Roadmapping', 'Agile', 'Jira'], resumeUrl: null, expectedSalary: '₹1.8L/mo', availability: 'Immediate' },
  { id: 8,  name: 'Meera Iyer',     email: 'meera@example.com',   phone: '+91 90000 22222', appliedRole: 'QA Engineer',         experience: '4 years', location: 'Chennai',   stage: 'Applied', appliedDate: '2025-01-04', skills: ['Selenium', 'Cypress', 'Jest'],  resumeUrl: null, expectedSalary: '₹80K/mo',  availability: '2 weeks'   },
  { id: 9,  name: 'Arjun Kapoor',   email: 'arjun@example.com',   phone: '+91 90000 33333', appliedRole: 'Mobile Developer',    experience: '3 years', location: 'Hyderabad', stage: 'Applied', appliedDate: '2025-01-03', skills: ['React Native', 'Flutter', 'iOS'], resumeUrl: null, expectedSalary: '₹1.2L/mo', availability: '1 month'   },
  { id: 10, name: 'Divya Menon',    email: 'divya@example.com',   phone: '+91 90000 44444', appliedRole: 'Content Strategist',  experience: '5 years', location: 'Kochi',     stage: 'Applied', appliedDate: '2025-01-02', skills: ['SEO', 'Copywriting', 'CMS'],   resumeUrl: null, expectedSalary: '₹70K/mo',  availability: 'Immediate' },
].map(a => ({
  ...a,
  expectedSalary: a.expectedSalary ?? '₹1L/mo',
  availability:   a.availability   ?? 'Immediate',
}));

const LOCATIONS   = ['All', 'Delhi', 'Noida', 'Gurugram', 'Bangalore', 'Mumbai', 'Pune', 'Hyderabad', 'Chennai', 'Kochi'];
const EXP_RANGES  = ['All', '0-2 years', '2-5 years', '5+ years'];
const AVAIL_OPTS  = ['All', 'Immediate', '2 weeks', '1 month'];
const AVATAR_COLORS = ['#8B3A8F', '#2563eb', '#0d9488', '#d97706', '#ea580c', '#16a34a', '#7c3aed', '#db2777'];

/* ── Resume Preview Modal ── */
const ResumeModal = ({ candidate, onClose }) => (
  <AnimatePresence>
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="px-8 py-5 border-b border-neutral-100 flex items-center justify-between shrink-0 bg-neutral-50/50">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Resume Preview</h3>
            <p className="text-xs text-neutral-500 mt-0.5">{candidate.name} — {candidate.appliedRole}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-400 hover:bg-white hover:text-neutral-700 transition-all shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Resume Content Placeholder */}
          <div className="flex items-start gap-6 border-b border-neutral-100 pb-8">
            <div className="w-20 h-20 rounded-2xl bg-brand-purple-600 flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow-lg shadow-purple-200">
              {candidate.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-neutral-900">{candidate.name}</h1>
              <p className="text-brand-purple-600 font-bold text-lg mt-1">{candidate.appliedRole}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-neutral-500 font-medium">
                <span className="flex items-center gap-1.5">📧 {candidate.email}</span>
                <span className="flex items-center gap-1.5">📞 {candidate.phone}</span>
                <span className="flex items-center gap-1.5">📍 {candidate.location}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-8">
              <section>
                <h4 className="text-sm font-black text-neutral-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-brand-purple-600 rounded-full" />
                  Professional Summary
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                  Results-driven {candidate.appliedRole} with {candidate.experience} of experience. 
                  Proven track record of delivering high-quality solutions and leading successful projects.
                  Expertise in {candidate.skills.slice(0, 3).join(', ')} and modern development methodologies.
                </p>
              </section>

              <section>
                <h4 className="text-sm font-black text-neutral-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-brand-purple-600 rounded-full" />
                  Experience
                </h4>
                <div className="space-y-6">
                  {[1, 2].map(i => (
                    <div key={i} className="relative pl-6 border-l-2 border-neutral-100">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-brand-purple-600" />
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="font-bold text-neutral-800 text-sm">Senior {candidate.appliedRole}</h5>
                        <span className="text-[10px] font-bold text-neutral-400">202{3-i} — Present</span>
                      </div>
                      <p className="text-xs text-brand-purple-600 font-bold mb-2">Global Tech Solutions Inc.</p>
                      <ul className="text-xs text-neutral-500 space-y-1.5 list-disc pl-4">
                        <li>Developed and maintained complex systems using {candidate.skills[0]}.</li>
                        <li>Collaborated with cross-functional teams to define project requirements.</li>
                        <li>Improved system performance by 40% through code optimization.</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className="bg-neutral-50 rounded-3xl p-6">
                <h4 className="text-xs font-black text-neutral-900 uppercase tracking-widest mb-4">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map(s => (
                    <span key={s} className="px-3 py-1.5 rounded-xl text-[10px] font-bold bg-white text-neutral-700 border border-neutral-100 shadow-sm">
                      {s}
                    </span>
                  ))}
                </div>
              </section>

              <section className="bg-brand-purple-50 rounded-3xl p-6">
                <h4 className="text-xs font-black text-neutral-900 uppercase tracking-widest mb-4 text-brand-purple-700">Education</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-neutral-800">Master of Technology</p>
                    <p className="text-[10px] text-brand-purple-600 font-semibold mt-0.5">IIT Delhi • 2021</p>
                  </div>
                  <div className="pt-3 border-t border-brand-purple-100">
                    <p className="text-xs font-bold text-neutral-800">Bachelor of Science</p>
                    <p className="text-[10px] text-brand-purple-600 font-semibold mt-0.5">Delhi University • 2019</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div className="px-8 py-5 border-t border-neutral-100 bg-neutral-50/50 flex gap-3 shrink-0">
          <button 
            onClick={() => {
              toast.success(`Downloading ${candidate.name}'s resume...`);
              // Mock download
              const blob = new Blob(['Resume content for ' + candidate.name], { type: 'text/plain' });
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${candidate.name.replace(/\s+/g, '_')}_Resume.pdf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            }}
            className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white shadow-lg shadow-purple-200 hover:opacity-90 transition-opacity" 
            style={{ background: '#8B3A8F' }}
          >
            📥 Download PDF
          </button>
          <button 
            onClick={() => {
              const profileLink = `${window.location.origin}/hire-zone/applicants?id=${candidate.id}`;
              navigator.clipboard.writeText(profileLink).then(() => {
                toast.success(`Profile link copied to clipboard!`);
              }).catch(() => {
                toast.error('Failed to copy link');
              });
            }}
            className="flex-1 py-3.5 rounded-2xl text-sm font-bold border-2 border-neutral-200 text-neutral-600 hover:bg-white transition-all"
          >
            🔗 Share Profile
          </button>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

const ResumeSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery]       = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState('All');
  const [expRange, setExpRange] = useState('All');
  const [avail, setAvail]       = useState('All');
  const [skillTag, setSkillTag] = useState('');
  const [shortlisted, setShortlisted] = useState([]);
  const [viewingResume, setViewingResume] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state with URL query param
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setQuery(q);
  }, [searchParams]);

  const handleShortlist = (candidate) => {
    if (shortlisted.includes(candidate.id)) {
      setShortlisted(prev => prev.filter(id => id !== candidate.id));
      toast.success(`${candidate.name} removed from shortlist.`);
    } else {
      setShortlisted(prev => [...prev, candidate.id]);
      toast.success(`${candidate.name} has been shortlisted!`, {
        icon: '⭐',
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    }
  };

  const handleViewResume = (candidate) => {
    setViewingResume(candidate);
  };

  const handleQueryChange = (val) => {
    setQuery(val);
    setSearchParams(prev => {
      if (val) prev.set('q', val);
      else prev.delete('q');
      return prev;
    }, { replace: true });
  };

  const matchExp = (exp) => {
    const yrs = parseInt(exp);
    if (expRange === 'All')       return true;
    if (expRange === '0-2 years') return yrs <= 2;
    if (expRange === '2-5 years') return yrs > 2 && yrs <= 5;
    if (expRange === '5+ years')  return yrs > 5;
    return true;
  };

  const filtered = RESUME_POOL.filter(c => {
    const q = query.toLowerCase();
    const matchQ    = !q || c.name.toLowerCase().includes(q) || c.appliedRole.toLowerCase().includes(q) ||
                      c.skills.some(s => s.toLowerCase().includes(q));
    const matchLoc  = location === 'All' || c.location === location;
    const matchExpR = matchExp(c.experience);
    const matchAv   = avail === 'All' || c.availability === avail;
    const matchSkill = !skillTag || c.skills.some(s => s.toLowerCase().includes(skillTag.toLowerCase()));
    return matchQ && matchLoc && matchExpR && matchAv && matchSkill;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <SectionHeader title="Resume Search" subtitle="Find the right talent from your candidate pool." />

        {/* Search bar row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 flex items-center gap-3 bg-white border border-neutral-200 rounded-2xl px-5 py-3.5 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B3A8F" strokeWidth="2" strokeLinecap="round" className="shrink-0">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name, role, or skill..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-neutral-700 placeholder-neutral-400 outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-neutral-400 hover:text-neutral-600">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            )}
            <span className="text-xs text-neutral-400 shrink-0 border-l border-neutral-100 pl-3 ml-1 hidden xs:block">{filtered.length} results</span>
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border border-neutral-200 bg-white text-sm font-bold text-neutral-700 shadow-sm active:scale-95 transition-transform"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            Filters
            {(location !== 'All' || expRange !== 'All' || avail !== 'All' || skillTag) && (
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 border-2 border-white" />
            )}
          </button>
        </div>

        {/* Mobile Filters Drawer */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden mb-6 bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-widest">Advanced Filters</h3>
                <button
                  onClick={() => { setLocation('All'); setExpRange('All'); setAvail('All'); setSkillTag(''); }}
                  className="text-[11px] font-bold text-red-500 uppercase tracking-wider"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Location</p>
                  <div className="flex flex-wrap gap-1.5">
                    {LOCATIONS.map(l => (
                      <button
                        key={l}
                        onClick={() => setLocation(l)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                          location === l ? 'bg-purple-600 border-purple-600 text-white shadow-md' : 'bg-white border-neutral-100 text-neutral-500'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Experience</p>
                  <div className="flex flex-wrap gap-1.5">
                    {EXP_RANGES.map(e => (
                      <button
                        key={e}
                        onClick={() => setExpRange(e)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                          expRange === e ? 'bg-purple-600 border-purple-600 text-white shadow-md' : 'bg-white border-neutral-100 text-neutral-500'
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Availability</p>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAIL_OPTS.map(a => (
                      <button
                        key={a}
                        onClick={() => setAvail(a)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                          avail === a ? 'bg-purple-600 border-purple-600 text-white shadow-md' : 'bg-white border-neutral-100 text-neutral-500'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Filter by Skill</p>
                  <input
                    type="text"
                    placeholder="e.g. React"
                    value={skillTag}
                    onChange={e => setSkillTag(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-700 outline-none focus:border-purple-400"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-5">
          {/* Filters sidebar */}
          <div className="w-52 shrink-0 space-y-5 hidden lg:block">
            <div className="bg-white rounded-2xl border border-neutral-100 p-4">
              <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-3">Filters</h3>

              {/* Location */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-neutral-500 mb-2">Location</p>
                <div className="space-y-1">
                  {LOCATIONS.map(l => (
                    <button
                      key={l}
                      onClick={() => setLocation(l)}
                      className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                        location === l ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-neutral-500 mb-2">Experience</p>
                <div className="space-y-1">
                  {EXP_RANGES.map(e => (
                    <button
                      key={e}
                      onClick={() => setExpRange(e)}
                      className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                        expRange === e ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-neutral-500 mb-2">Availability</p>
                <div className="space-y-1">
                  {AVAIL_OPTS.map(a => (
                    <button
                      key={a}
                      onClick={() => setAvail(a)}
                      className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                        avail === a ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skill filter */}
              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-2">Skill</p>
                <input
                  type="text"
                  placeholder="e.g. React"
                  value={skillTag}
                  onChange={e => setSkillTag(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-purple-400 transition-all"
                />
              </div>

              {/* Reset */}
              {(location !== 'All' || expRange !== 'All' || avail !== 'All' || skillTag) && (
                <button
                  onClick={() => { setLocation('All'); setExpRange('All'); setAvail('All'); setSkillTag(''); }}
                  className="w-full mt-4 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Resume cards grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-100 py-20 text-center">
                <p className="text-neutral-400 text-sm">No candidates match your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -2, boxShadow: '0 8px 24px -4px rgba(0,0,0,0.10)' }}
                    className="bg-white rounded-2xl border border-neutral-100 p-5 transition-shadow cursor-pointer"
                  >
                    {/* Card header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0"
                        style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                      >
                        {c.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-neutral-900 truncate">{c.name}</h3>
                        <p className="text-xs text-neutral-500 truncate">{c.appliedRole}</p>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-neutral-400">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {c.location}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        c.availability === 'Immediate' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {c.availability}
                      </span>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 mb-3 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {c.experience}
                      </span>
                      <span className="text-neutral-200">|</span>
                      <span className="font-semibold text-neutral-700">{c.expectedSalary}</span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {c.skills.map(s => (
                        <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-600">
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-neutral-50">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleShortlist(c); }}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                          shortlisted.includes(c.id) ? 'bg-amber-500 text-white' : 'bg-brand-purple-600 text-white hover:bg-brand-purple-700'
                        }`}
                        style={!shortlisted.includes(c.id) ? { background: '#8B3A8F' } : {}}
                      >
                        {shortlisted.includes(c.id) ? '⭐ Shortlisted' : 'Shortlist'}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleViewResume(c); }}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
                      >
                        View Resume
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Resume Modal */}
      {viewingResume && (
        <ResumePreviewModal
          candidate={viewingResume}
          onClose={() => setViewingResume(null)}
        />
      )}
    </div>
  );
};

export default ResumeSearch;
