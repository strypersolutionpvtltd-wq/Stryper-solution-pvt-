import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import SectionHeader from '@/hire-zone/components/shared/SectionHeader';
import ResumePreviewModal from '@/hire-zone/components/shared/ResumePreviewModal';
import { candidateProfile as candidateAPI, shortlist as shortlistAPI } from '@/utils/api';
import toast from 'react-hot-toast';

const LOCATIONS  = ['All', 'Delhi', 'Noida', 'Gurugram', 'Bangalore', 'Mumbai', 'Pune', 'Hyderabad', 'Chennai', 'Kochi', 'Remote'];
const EXP_RANGES = ['All', '0-2 years', '2-5 years', '5+ years'];
const AVAIL_OPTS = ['All', 'Immediate', '15 days', '1 month', '2 months', '3 months'];
const AVATAR_COLORS = ['#8B3A8F', '#2563eb', '#0d9488', '#d97706', '#ea580c', '#16a34a', '#7c3aed', '#db2777'];

// ── Skeleton loader ──────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-neutral-100 p-5 animate-pulse">
    <div className="flex items-start gap-3 mb-4">
      <div className="w-12 h-12 rounded-xl bg-neutral-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-neutral-200 rounded w-2/3" />
        <div className="h-3 bg-neutral-100 rounded w-1/2" />
        <div className="h-3 bg-neutral-100 rounded w-1/3" />
      </div>
    </div>
    <div className="flex gap-2 mb-4">
      {[1,2,3].map(i => <div key={i} className="h-5 bg-neutral-100 rounded-md w-14" />)}
    </div>
    <div className="flex gap-2 pt-3 border-t border-neutral-50">
      <div className="flex-1 h-8 bg-neutral-200 rounded-xl" />
      <div className="flex-1 h-8 bg-neutral-100 rounded-xl" />
    </div>
  </div>
);

// ── Filter sidebar (shared between desktop & mobile) ─────────────────────────
const FilterPanel = ({ location, setLocation, expRange, setExpRange, avail, setAvail, skillTag, setSkillTag, onClear }) => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Filters</h3>
      {(location !== 'All' || expRange !== 'All' || avail !== 'All' || skillTag) && (
        <button onClick={onClear} className="text-[11px] font-bold text-red-500 hover:text-red-600">Clear All</button>
      )}
    </div>

    <div>
      <p className="text-xs font-semibold text-neutral-500 mb-2">Location</p>
      <div className="space-y-1">
        {LOCATIONS.map(l => (
          <button key={l} onClick={() => setLocation(l)}
            className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors ${location === l ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-neutral-600 hover:bg-neutral-50'}`}>
            {l}
          </button>
        ))}
      </div>
    </div>

    <div>
      <p className="text-xs font-semibold text-neutral-500 mb-2">Experience</p>
      <div className="space-y-1">
        {EXP_RANGES.map(e => (
          <button key={e} onClick={() => setExpRange(e)}
            className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors ${expRange === e ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-neutral-600 hover:bg-neutral-50'}`}>
            {e}
          </button>
        ))}
      </div>
    </div>

    <div>
      <p className="text-xs font-semibold text-neutral-500 mb-2">Availability</p>
      <div className="space-y-1">
        {AVAIL_OPTS.map(a => (
          <button key={a} onClick={() => setAvail(a)}
            className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors ${avail === a ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-neutral-600 hover:bg-neutral-50'}`}>
            {a}
          </button>
        ))}
      </div>
    </div>

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
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const ResumeSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery]       = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState('All');
  const [expRange, setExpRange] = useState('All');
  const [avail, setAvail]       = useState('All');
  const [skillTag, setSkillTag] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [shortlisted, setShortlisted] = useState([]);
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [shortlistOpen, setShortlistOpen] = useState(true);
  const [viewingResume, setViewingResume] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const debounceRef = useRef(null);

  const fetchCandidates = useCallback(async (params) => {
    setLoading(true);
    try {
      const res = await candidateAPI.search({
        q: params.q || undefined,
        location: params.location !== 'All' ? params.location : undefined,
        experience: params.expRange !== 'All' ? params.expRange : undefined,
        availability: params.avail !== 'All' ? params.avail : undefined,
        skill: params.skillTag || undefined,
      });
      const fetched = res.data.candidates || [];
      setCandidates(fetched);
      setTotal(res.data.pagination?.total || 0);
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
      toast.error('Failed to load candidates');
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchShortlist = useCallback(async () => {
    try {
      const res = await shortlistAPI.get();
      if (res.data?.success) {
        const fetched = res.data.candidates || [];
        setShortlistedCandidates(fetched);
        setShortlisted(fetched.map(c => String(c.id)));
      }
    } catch (err) {
      console.error('Failed to fetch shortlist:', err);
    }
  }, []);

  useEffect(() => {
    fetchShortlist();
  }, [fetchShortlist]);

  // Debounced fetch on filter change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchCandidates({ q: query, location, expRange, avail, skillTag });
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [query, location, expRange, avail, skillTag, fetchCandidates]);

  // Sync query param
  const handleQueryChange = (val) => {
    setQuery(val);
    setSearchParams(prev => {
      if (val) prev.set('q', val);
      else prev.delete('q');
      return prev;
    }, { replace: true });
  };

  const handleShortlist = async (candidate) => {
    const isShortlisted = shortlisted.includes(candidate.id);
    try {
      if (isShortlisted) {
        await shortlistAPI.remove(candidate.id);
        setShortlisted(prev => prev.filter(id => id !== candidate.id));
        setShortlistedCandidates(prev => prev.filter(c => c.id !== candidate.id));
        toast(`${candidate.name} removed from shortlist`);
      } else {
        await shortlistAPI.add(candidate.id);
        setShortlisted(prev => [...prev, candidate.id]);
        setShortlistedCandidates(prev => [...prev, candidate]);
        toast.success(`${candidate.name} shortlisted!`, { icon: '⭐' });
      }
    } catch (err) {
      console.error('Failed to update shortlist:', err);
      toast.error(err.response?.data?.message || 'Failed to update shortlist');
    }
  };

  const clearFilters = () => {
    setLocation('All');
    setExpRange('All');
    setAvail('All');
    setSkillTag('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <SectionHeader title="Resume Search" subtitle="Find the right talent from your candidate pool." />

        {/* ── Shortlisted Section ─────────────────────────────── */}
        {shortlistedCandidates.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShortlistOpen(o => !o)}
              className="flex items-center justify-between w-full bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 text-left hover:bg-amber-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">⭐</span>
                <div>
                  <p className="text-sm font-bold text-amber-800">Shortlisted Candidates</p>
                  <p className="text-xs text-amber-600">{shortlistedCandidates.length} candidate{shortlistedCandidates.length > 1 ? 's' : ''} shortlisted</p>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round"
                className={`transition-transform ${shortlistOpen ? 'rotate-180' : ''}`}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            <AnimatePresence>
              {shortlistOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                    {shortlistedCandidates.map((c, i) => (
                      <motion.div key={c.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl border border-amber-200 p-5 flex flex-col shadow-sm"
                      >
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-3">
                          {c.profilePicture ? (
                            <img src={c.profilePicture} alt={c.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                          ) : (
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-base font-bold shrink-0"
                              style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                              {(c.name || '?').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-sm font-bold text-neutral-900 truncate leading-tight">{c.name}</h3>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                c.availability === 'Immediate' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                              }`}>{c.availability}</span>
                            </div>
                            <p className="text-xs text-neutral-500 truncate mt-0.5">{c.role || 'Candidate'}</p>
                            {c.location && (
                              <div className="flex items-center gap-1 mt-1 text-[10px] text-neutral-400">
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                {c.location}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        {(c.experience || c.expectedSalary) && (
                          <div className="flex items-center gap-3 mb-3 text-xs text-neutral-500">
                            {c.experience && <span className="flex items-center gap-1"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>{c.experience}</span>}
                            {c.experience && c.expectedSalary && <span className="text-neutral-200">|</span>}
                            {c.expectedSalary && <span className="font-semibold text-neutral-700">{c.expectedSalary}</span>}
                          </div>
                        )}

                        {/* Skills */}
                        {c.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {c.skills.slice(0, 4).map(s => (
                              <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-600">{s}</span>
                            ))}
                            {c.skills.length > 4 && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-500">+{c.skills.length - 4}</span>}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-3 border-t border-neutral-50 mt-auto">
                          <button
                            onClick={() => handleShortlist(c)}
                            className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all bg-amber-500 text-white hover:bg-amber-600"
                          >
                            ✕ Remove from Shortlist
                          </button>
                          <button
                            onClick={() => setViewingResume(c)}
                            className="flex-1 py-2 rounded-xl text-xs font-semibold border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
                          >
                            View Resume
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Search bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 flex items-center gap-3 bg-white border border-neutral-200 rounded-2xl px-5 py-3.5 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B3A8F" strokeWidth="2" strokeLinecap="round" className="shrink-0">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name, role, or skill..."
              value={query}
              onChange={e => handleQueryChange(e.target.value)}
              className="flex-1 bg-transparent text-sm text-neutral-700 placeholder-neutral-400 outline-none"
            />
            {query && (
              <button onClick={() => handleQueryChange('')} className="text-neutral-400 hover:text-neutral-600">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            )}
            <span className="text-xs text-neutral-400 shrink-0 border-l border-neutral-100 pl-3 ml-1 hidden sm:block">
              {loading ? '...' : `${total} results`}
            </span>
          </div>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border border-neutral-200 bg-white text-sm font-bold text-neutral-700 shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            Filters
            {(location !== 'All' || expRange !== 'All' || avail !== 'All' || skillTag) && (
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            )}
          </button>
        </div>

        {/* Mobile filters */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden mb-6 bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm"
            >
              <FilterPanel {...{ location, setLocation, expRange, setExpRange, avail, setAvail, skillTag, setSkillTag, onClear: clearFilters }} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-5">
          {/* Desktop sidebar */}
          <div className="w-52 shrink-0 hidden lg:block">
            <div className="bg-white rounded-2xl border border-neutral-100 p-4 sticky top-4">
              <FilterPanel {...{ location, setLocation, expRange, setExpRange, avail, setAvail, skillTag, setSkillTag, onClear: clearFilters }} />
            </div>
          </div>

          {/* Cards grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : candidates.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-100 py-20 text-center">
                <svg className="mx-auto mb-3 text-neutral-300" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <p className="text-neutral-500 font-medium text-sm">No candidates found</p>
                <p className="text-neutral-400 text-xs mt-1">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidates.filter(c => !shortlisted.includes(String(c.id))).map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -2, boxShadow: '0 8px 24px -4px rgba(0,0,0,0.10)' }}
                    className="bg-white rounded-2xl border border-neutral-100 p-5 transition-shadow flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      {c.profilePicture ? (
                        <img src={c.profilePicture} alt={c.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                      ) : (
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-base font-bold shrink-0"
                          style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                          {(c.name || '?').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-bold text-neutral-900 truncate leading-tight">{c.name}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            c.availability === 'Immediate' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                          }`}>{c.availability}</span>
                        </div>
                        <p className="text-xs text-neutral-500 truncate mt-0.5">{c.role || 'Candidate'}</p>
                        {c.location && (
                          <div className="flex items-center gap-1 mt-1 text-[10px] text-neutral-400">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            {c.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats row */}
                    {(c.experience || c.expectedSalary) && (
                      <div className="flex items-center gap-3 mb-3 text-xs text-neutral-500">
                        {c.experience && (
                          <span className="flex items-center gap-1">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            {c.experience}
                          </span>
                        )}
                        {c.experience && c.expectedSalary && <span className="text-neutral-200">|</span>}
                        {c.expectedSalary && (
                          <span className="font-semibold text-neutral-700">{c.expectedSalary}</span>
                        )}
                      </div>
                    )}

                    {/* Skills */}
                    {c.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {c.skills.slice(0, 4).map(s => (
                          <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-600">
                            {s}
                          </span>
                        ))}
                        {c.skills.length > 4 && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-500">
                            +{c.skills.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-neutral-50 mt-auto">
                      <button
                        onClick={() => handleShortlist(c)}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                          shortlisted.includes(c.id) ? 'bg-amber-500 text-white' : 'text-white hover:opacity-90'
                        }`}
                        style={!shortlisted.includes(c.id) ? { background: '#8B3A8F' } : {}}
                      >
                        {shortlisted.includes(c.id) ? '⭐ Shortlisted' : 'Shortlist'}
                      </button>
                      <button
                        onClick={() => setViewingResume(c)}
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

      {viewingResume && (
        <ResumePreviewModal candidate={viewingResume} onClose={() => setViewingResume(null)} />
      )}
    </div>
  );
};

export default ResumeSearch;
