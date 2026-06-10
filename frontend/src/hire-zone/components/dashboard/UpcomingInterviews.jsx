import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { interviews } from '@/utils/api';
import { UPCOMING_INTERVIEWS } from '@/hire-zone/data/mockDashboard';

const TYPE_STYLE = {
  Video:      { bg: '#dbeafe', text: '#2563eb', icon: '📹' },
  'In-person':{ bg: '#dcfce7', text: '#16a34a', icon: '🏢' },
  Phone:      { bg: '#fef3c7', text: '#d97706', icon: '📞' },
};

const UpcomingInterviews = () => {
  const [interviewList, setInterviewList] = useState(UPCOMING_INTERVIEWS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await interviews.getCompanyInterviews();
        const data = (res.data.interviews || []).map(iv => ({
          id: iv._id,
          candidate: iv.candidateId?.firstName + ' ' + iv.candidateId?.lastName || 'Unknown',
          role: iv.jobId?.title || 'Position',
          time: new Date(iv.scheduledTime).toLocaleString(),
          type: iv.interviewType || 'Video',
          avatar: (iv.candidateId?.firstName || 'U').charAt(0),
        }));
        setInterviewList(data.length > 0 ? data : UPCOMING_INTERVIEWS);
      } catch (error) {
        console.error('Failed to fetch interviews:', error);
        setInterviewList(UPCOMING_INTERVIEWS);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-800">Upcoming Interviews</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Next 3 days</p>
        </div>
        <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">
          {interviewList.length}
        </span>
      </div>

      <div className="space-y-2.5">
        {interviewList.map((iv, i) => {
          const t = TYPE_STYLE[iv.type] ?? TYPE_STYLE.Video;
          return (
            <motion.div
              key={iv.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                style={{ background: '#8B3A8F' }}
              >
                {iv.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-800 truncate">{iv.candidate}</p>
                <p className="text-xs text-neutral-400 truncate">{iv.role}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-medium text-neutral-700">{iv.time}</p>
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                  style={{ background: t.bg, color: t.text }}
                >
                  {t.icon} {iv.type}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingInterviews;
