import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/hire-zone/components/shared/SectionHeader';
import StatusBadge from '@/hire-zone/components/shared/StatusBadge';
import ApplicantDetailModal from '@/hire-zone/components/applicants/ApplicantDetailModal';
import { MOCK_APPLICANTS } from '@/hire-zone/data/mockApplicants';

const STAGES = ['All', 'Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];
const AVATAR_COLORS = ['#8B3A8F', '#2563eb', '#0d9488', '#d97706', '#ea580c', '#16a34a'];

const PIPELINE_STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];

const Applicants = () => {
  const [applicants, setApplicants] = useState(MOCK_APPLICANTS);
  const [stageFilter, setStageFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = applicants.filter(a => {
    const matchStage  = stageFilter === 'All' || a.stage === stageFilter;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
                        a.appliedRole.toLowerCase().includes(search.toLowerCase());
    return matchStage && matchSearch;
  });

  const handleStageChange = (id, newStage) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, stage: newStage } : a));
    setSelected(prev => prev?.id === id ? { ...prev, stage: newStage } : prev);
  };

  const stageCounts = STAGES.reduce((acc, s) => {
    acc[s] = s === 'All' ? applicants.length : applicants.filter(a => a.stage === s).length;
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <SectionHeader title="Applicants" subtitle="Review and manage all candidates in your pipeline." />

        {/* Pipeline overview bar */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {PIPELINE_STAGES.map((stage, i) => {
            const count = applicants.filter(a => a.stage === stage).length;
            const colors = ['#6366f1', '#8B3A8F', '#f59e0b', '#10b981', '#0d9488'];
            return (
              <motion.button
                key={stage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setStageFilter(stage)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  stageFilter === stage ? 'border-transparent shadow-md' : 'bg-white border-neutral-100 hover:border-neutral-200'
                }`}
                style={stageFilter === stage ? { background: colors[i], color: 'white' } : {}}
              >
                <p className={`text-xl font-bold ${stageFilter === stage ? 'text-white' : 'text-neutral-900'}`}>{count}</p>
                <p className={`text-[10px] font-semibold mt-0.5 ${stageFilter === stage ? 'text-white/80' : 'text-neutral-400'}`}>{stage}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-xl px-4 py-2.5 flex-1 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-neutral-400 shrink-0">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name or role..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-neutral-700 placeholder-neutral-400 outline-none flex-1"
            />
          </div>
          <div className="flex items-center gap-1 bg-neutral-100 rounded-xl p-1 overflow-x-auto">
            {['All', 'Applied', 'Screening', 'Interview', 'Offer', 'Hired'].map(s => (
              <button
                key={s}
                onClick={() => setStageFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  stageFilter === s ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {s} ({stageCounts[s]})
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-neutral-50 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
            <div className="col-span-3">Candidate</div>
            <div className="col-span-2">Applied Role</div>
            <div className="col-span-2">Skills</div>
            <div className="col-span-1">Experience</div>
            <div className="col-span-2">Stage</div>
            <div className="col-span-1">Date</div>
            <div className="col-span-1">Action</div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-neutral-400 text-sm">No applicants match your filters.</div>
          ) : (
            <div className="divide-y divide-neutral-50">
              {filtered.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-neutral-50/60 transition-colors cursor-pointer group"
                  onClick={() => setSelected(app)}
                >
                  {/* Candidate */}
                  <div className="col-span-12 md:col-span-3 flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                    >
                      {app.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-800 truncate group-hover:text-purple-700 transition-colors">{app.name}</p>
                      <p className="text-xs text-neutral-400 truncate">{app.location}</p>
                    </div>
                  </div>

                  <div className="hidden md:block col-span-2">
                    <p className="text-sm text-neutral-700 truncate">{app.appliedRole}</p>
                  </div>

                  <div className="hidden md:flex col-span-2 flex-wrap gap-1">
                    {app.skills.slice(0, 2).map(s => (
                      <span key={s} className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-600 font-medium">{s}</span>
                    ))}
                    {app.skills.length > 2 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-500">+{app.skills.length - 2}</span>
                    )}
                  </div>

                  <div className="hidden md:block col-span-1">
                    <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">{app.experience}</span>
                  </div>

                  <div className="hidden md:block col-span-2">
                    <StatusBadge status={app.stage} />
                  </div>

                  <div className="hidden md:block col-span-1">
                    <p className="text-xs text-neutral-400">{app.appliedDate.slice(5)}</p>
                  </div>

                  <div className="hidden md:block col-span-1">
                    <button
                      onClick={e => { e.stopPropagation(); setSelected(app); }}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors"
                      style={{ color: '#8B3A8F', background: '#f3e8f4' }}
                    >
                      View
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-neutral-400 text-center mt-4">
          Showing {filtered.length} of {applicants.length} applicants
        </p>
      </motion.div>

      {/* Detail modal */}
      {selected && (
        <ApplicantDetailModal
          applicant={selected}
          onClose={() => setSelected(null)}
          onStageChange={handleStageChange}
        />
      )}
    </div>
  );
};

export default Applicants;
