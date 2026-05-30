import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_INTERVIEWS = [
  { 
    id: 1, 
    company: 'Acme Services Pvt. Ltd.', 
    role: 'Frontend Developer', 
    date: '2025-01-13', 
    time: '2:00 PM', 
    type: 'Video', 
    status: 'Scheduled', 
    interviewer: 'Amit Kumar (HR)', 
    platform: 'Google Meet',
    link: 'https://meet.google.com/abc-defg-hij', // Simulating a link provided by company
    color: '#8B3A8F'
  },
  { 
    id: 2, 
    company: 'Global Tech Solutions', 
    role: 'React Developer', 
    date: '2025-01-15', 
    time: '11:00 AM', 
    type: 'Video', 
    status: 'Scheduled', 
    interviewer: 'Sneha Joshi', 
    platform: null,
    link: null, // Link not yet provided
    color: '#2563eb'
  }
];

const Interviews = () => {
  const [interviews] = useState(MOCK_INTERVIEWS);

  const handleJoin = (link) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">My Interviews</h1>
        <p className="text-sm text-neutral-500 font-medium">Keep track of your upcoming and past interview sessions.</p>
      </div>

      <div className="grid gap-4">
        {interviews.map((iv, i) => (
          <motion.div
            key={iv.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              {/* Left: Company Icon/Initial */}
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg shadow-neutral-100"
                style={{ background: iv.color }}
              >
                {iv.company.charAt(0)}
              </div>

              {/* Middle: Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-neutral-900 truncate">{iv.company}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                    {iv.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-brand-purple-600 mb-2">{iv.role}</p>
                
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {new Date(iv.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {iv.time}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    {iv.interviewer}
                  </div>
                </div>
              </div>

              {/* Right: Action */}
              <div className="shrink-0 flex flex-col gap-2">
                {iv.link ? (
                  <button
                    onClick={() => handleJoin(iv.link)}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-green-100 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 bg-green-600"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Join Meeting ({iv.platform})
                  </button>
                ) : (
                  <div className="px-6 py-2.5 rounded-xl text-xs font-bold text-neutral-400 bg-neutral-50 border border-neutral-100 flex items-center justify-center gap-2 cursor-not-allowed">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    Waiting for Link
                  </div>
                )}
                <p className="text-[10px] text-center text-neutral-400 font-semibold uppercase tracking-wider">
                  Type: {iv.type}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {interviews.length === 0 && (
        <div className="bg-white rounded-3xl border border-neutral-100 py-20 text-center">
          <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📅</div>
          <h3 className="text-lg font-bold text-neutral-800">No Interviews Scheduled</h3>
          <p className="text-sm text-neutral-500 max-w-xs mx-auto mt-1">When companies invite you for an interview, they will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default Interviews;
