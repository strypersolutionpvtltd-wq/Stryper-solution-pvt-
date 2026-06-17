import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { savedJobs as savedJobsAPI, jobApplications } from '@/utils/api';

const SavedJobs = () => {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await savedJobsAPI.getAll();
        const data = (res.data?.savedJobs || []).map(sj => ({
          id:         sj.jobId?._id || sj.jobId,
          savedId:    sj._id,
          title:      sj.jobId?.title || 'Job Position',
          company:    sj.jobId?.companyId?.companyName || 'Company',
          location:   sj.jobId?.location || '—',
          salary:     sj.jobId?.salaryMin ? `₹${sj.jobId.salaryMin}–${sj.jobId.salaryMax} LPA` : 'Not disclosed',
          type:       sj.jobId?.employmentType || 'Full-time',
          postedDate: sj.jobId?.createdAt ? new Date(sj.jobId.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—',
          applied:    false,
        }));
        setJobs(data);
      } catch (err) {
        console.error('Failed to fetch saved jobs:', err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleApply = async (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job || job.applied) return;
    try {
      await jobApplications.apply({ jobId });
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applied: true } : j));
      toast.success(`Applied for ${job.title}!`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to apply');
    }
  };

  const handleRemove = async (savedId, jobId) => {
    try {
      await savedJobsAPI.remove(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
      toast.success('Removed from saved jobs');
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  if (loading) return <div className="text-center py-16 text-neutral-400"><p className="text-sm">Loading saved jobs...</p></div>;

  return (
    <div>
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 mb-4">
        <h1 className="text-lg font-bold text-neutral-800 mb-1">Saved Jobs</h1>
        <p className="text-sm text-neutral-500">{jobs.length} jobs bookmarked</p>
      </div>

      <div className="space-y-3">
        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-16 text-center">
            <div className="text-4xl mb-3">🔖</div>
            <p className="font-semibold text-neutral-700">No saved jobs yet</p>
            <p className="text-sm text-neutral-400 mt-1">Browse jobs and save ones you're interested in.</p>
          </div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center text-sm font-bold text-neutral-600 shrink-0">
                {job.company[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-neutral-800 text-sm">{job.title}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{job.company} · {job.location}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-neutral-400">{job.salary}</span>
                  <span className="w-1 h-1 rounded-full bg-neutral-300" />
                  <span className="text-xs text-neutral-400">{job.type}</span>
                  <span className="w-1 h-1 rounded-full bg-neutral-300" />
                  <span className="text-xs text-neutral-400">Posted {job.postedDate}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleApply(job.id)} disabled={job.applied}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${job.applied ? 'bg-green-50 text-green-600 border border-green-200 cursor-default' : 'text-white hover:opacity-90'}`}
                  style={!job.applied ? { background: '#8B3A8F' } : {}}>
                  {job.applied ? '✓ Applied' : 'Apply Now'}
                </button>
                <button onClick={() => handleRemove(job.savedId, job.id)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
