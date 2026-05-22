import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/hire-zone/components/shared/SectionHeader';
import { MOCK_APPLICANTS } from '@/hire-zone/data/mockApplicants';

// Extend mock data with extra fields for resume search
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

const ResumeSearch = () => {
  const [query, setQuery]       = useState('');
  const [location, setLocation] = useState('All');
  const [expRange, setExpRange] = useState('All');
  const [avail, setAvail]       = useState('All');
  const [skillTag, setSkillTag] = useState('');

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

        {/* Search bar */}
        <div className="flex items-center gap-3 bg-white border border-neutral-200 rounded-2xl px-5 py-3.5 mb-5 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all shadow-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B3A8F" strokeWidth="2" strokeLinecap="round" className="shrink-0">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name, role, or skill (e.g. React, DevOps, Product Manager)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-neutral-700 placeholder-neutral-400 outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-neutral-400 hover:text-neutral-600">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          )}
          <span className="text-xs text-neutral-400 shrink-0">{filtered.length} results</span>
        </div>

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
                        className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-colors"
                        style={{ background: '#8B3A8F' }}
                      >
                        Shortlist
                      </button>
                      <button className="flex-1 py-2 rounded-xl text-xs font-semibold border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
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
    </div>
  );
};

export default ResumeSearch;
