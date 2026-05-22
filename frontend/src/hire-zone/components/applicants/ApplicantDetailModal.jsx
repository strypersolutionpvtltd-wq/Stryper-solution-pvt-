import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '@/hire-zone/components/shared/StatusBadge';

const AVATAR_COLORS = ['#8B3A8F', '#2563eb', '#0d9488', '#d97706', '#ea580c', '#16a34a'];

const PIPELINE_STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];

const ApplicantDetailModal = ({ applicant, onClose, onStageChange }) => {
  if (!applicant) return null;

  const colorIdx = applicant.id % AVATAR_COLORS.length;
  const currentStageIdx = PIPELINE_STAGES.indexOf(applicant.stage);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="flex-1 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />

        {/* Slide-over panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 shrink-0">
            <h2 className="text-sm font-semibold text-neutral-800">Applicant Profile</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="flex-1 p-6 space-y-6">
            {/* Profile header */}
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0"
                style={{ background: AVATAR_COLORS[colorIdx] }}
              >
                {applicant.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900">{applicant.name}</h3>
                <p className="text-sm text-neutral-500">{applicant.appliedRole}</p>
                <div className="mt-1">
                  <StatusBadge status={applicant.stage} />
                </div>
              </div>
            </div>

            {/* Contact info */}
            <div className="bg-neutral-50 rounded-xl p-4 space-y-2.5">
              <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Contact</h4>
              {[
                { icon: '✉️', label: applicant.email },
                { icon: '📞', label: applicant.phone },
                { icon: '📍', label: applicant.location },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-neutral-700">
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Experience', value: applicant.experience },
                { label: 'Applied Date', value: applicant.appliedDate },
                { label: 'Applied Role', value: applicant.appliedRole },
                { label: 'Location', value: applicant.location },
              ].map(({ label, value }) => (
                <div key={label} className="bg-neutral-50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-sm font-medium text-neutral-800">{value}</p>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {applicant.skills.map(s => (
                  <span key={s} className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Pipeline progress */}
            <div>
              <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Hiring Pipeline</h4>
              <div className="flex items-center gap-1">
                {PIPELINE_STAGES.map((stage, i) => {
                  const isPast    = i < currentStageIdx;
                  const isCurrent = i === currentStageIdx;
                  return (
                    <div key={stage} className="flex items-center flex-1">
                      <button
                        onClick={() => onStageChange?.(applicant.id, stage)}
                        className={`flex-1 py-1.5 text-[10px] font-semibold rounded-lg text-center transition-all ${
                          isCurrent ? 'text-white shadow-sm' :
                          isPast    ? 'text-white opacity-70' :
                                      'text-neutral-400 bg-neutral-100 hover:bg-neutral-200'
                        }`}
                        style={isCurrent || isPast ? { background: '#8B3A8F' } : {}}
                      >
                        {stage}
                      </button>
                      {i < PIPELINE_STAGES.length - 1 && (
                        <div className={`w-2 h-0.5 shrink-0 ${isPast || isCurrent ? 'bg-purple-400' : 'bg-neutral-200'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action footer */}
          <div className="px-6 py-4 border-t border-neutral-100 flex gap-2 shrink-0">
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
              style={{ background: '#8B3A8F' }}
              onClick={() => onStageChange?.(applicant.id, 'Interview')}
            >
              Schedule Interview
            </button>
            <button
              className="px-4 py-2.5 rounded-xl text-sm font-semibold border-2 border-red-200 text-red-500 hover:bg-red-50 transition-colors"
              onClick={() => onStageChange?.(applicant.id, 'Rejected')}
            >
              Reject
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ApplicantDetailModal;
