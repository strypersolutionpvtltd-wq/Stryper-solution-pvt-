import { MOCK_SAVED_JOBS } from '@/career-hub/data/mockCandidate';

const SavedJobs = () => (
  <div>
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 mb-4">
      <h1 className="text-lg font-bold text-neutral-800 mb-1">Saved Jobs</h1>
      <p className="text-sm text-neutral-500">{MOCK_SAVED_JOBS.length} jobs bookmarked</p>
    </div>

    <div className="space-y-3">
      {MOCK_SAVED_JOBS.map(job => (
        <div key={job.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center text-sm font-bold text-neutral-600 shrink-0">
            {job.company[0]}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-neutral-800 text-sm">{job.title}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{job.company} · {job.location}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-neutral-400">{job.salary}</span>
              <span className="w-1 h-1 rounded-full bg-neutral-300" />
              <span className="text-xs text-neutral-400">{job.type}</span>
              <span className="w-1 h-1 rounded-full bg-neutral-300" />
              <span className="text-xs text-neutral-400">Posted {job.postedDate}</span>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors"
              style={{ background: '#8B3A8F' }}
            >
              Apply
            </button>
            <button className="px-3 py-2 rounded-xl text-xs font-semibold border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition-colors">
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SavedJobs;
