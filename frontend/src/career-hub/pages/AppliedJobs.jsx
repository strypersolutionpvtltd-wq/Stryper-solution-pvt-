import { useState, useEffect } from 'react';
import { jobApplications } from '@/utils/api';

const STATUS_STYLES = {
  'Applied':             'bg-blue-50 text-blue-700 border-blue-200',
  'Under Review':        'bg-blue-50 text-blue-700 border-blue-200',
  'Shortlisted':         'bg-green-50 text-green-700 border-green-200',
  'Rejected':            'bg-red-50 text-red-700 border-red-200',
  'Interview Scheduled': 'bg-purple-50 text-purple-700 border-purple-200',
  'Accepted':            'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const AppliedJobs = () => {
  const [apps, setApps]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await jobApplications.getMyApplications();
        const list = (res.data?.applications || []).map(app => ({
          id:          app._id,
          title:       app.jobId?.title || 'Job Position',
          company:     app.jobId?.companyId?.companyName || app.companyId?.companyName || 'Company',
          location:    app.jobId?.location || '—',
          appliedDate: app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
          status:      app.status || 'Applied',
        }));
        setApps(list);
      } catch (err) {
        console.error('Failed to fetch applications:', err);
        setApps([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return (
    <div className="text-center py-16 text-neutral-400"><p className="text-sm">Loading applications...</p></div>
  );

  return (
    <div>
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 mb-4">
        <h1 className="text-lg font-bold text-neutral-800 mb-1">Applied Jobs</h1>
        <p className="text-sm text-neutral-500">{apps.length} application{apps.length !== 1 ? 's' : ''} tracked</p>
      </div>

      <div className="space-y-3">
        {apps.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-16 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="font-semibold text-neutral-700">No applications yet</p>
            <p className="text-sm text-neutral-400 mt-1">Start applying to jobs and they'll appear here.</p>
          </div>
        ) : (
          apps.map(app => (
            <div key={app.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center text-sm font-bold text-neutral-600 shrink-0">
                {app.company[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-neutral-800 text-sm">{app.title}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{app.company} · {app.location}</p>
                <p className="text-xs text-neutral-400 mt-0.5">Applied {app.appliedDate}</p>
              </div>
              <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[app.status] ?? 'bg-neutral-100 text-neutral-600 border-neutral-200'}`}>
                {app.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;
