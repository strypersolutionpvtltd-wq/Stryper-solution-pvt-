import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { dashboard } from '@/utils/api';

const StatCard = ({ icon, label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wide">{label}</p>
        <p className="text-3xl font-bold text-neutral-900 mt-1">{value}</p>
      </div>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: `${color}20` }}>
        {icon}
      </div>
    </div>
  </motion.div>
);

const RecentActivityCard = ({ activity }) => (
  <motion.div
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-start gap-3 pb-4 border-b border-neutral-50 last:border-b-0"
  >
    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: activity.color + '20' }}>
      {activity.icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-neutral-800">{activity.title}</p>
      <p className="text-xs text-neutral-500 mt-0.5">{activity.description}</p>
      <p className="text-[10px] text-neutral-400 mt-1">{activity.time}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { userData } = useAuth();
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    saved: 0,
    profile: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboard.getCandidate();
        if (res.data) {
          setStats(res.data.stats || { applications: 0, interviews: 0, saved: 0, profile: 0 });
          setActivities(res.data.activities || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        // Set default zeros — no mock data
        setStats({ applications: 0, interviews: 0, saved: 0, profile: 0 });
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12 text-neutral-400">
        <p className="text-sm">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Welcome back, {userData?.email?.split('@')[0] || 'there'}! 👋</h1>
        <p className="text-sm text-neutral-500 mt-1">Here's your job search progress at a glance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📬" label="Applications" value={stats.applications} color="#8B3A8F" />
        <StatCard icon="📅" label="Interviews" value={stats.interviews} color="#3B82F6" />
        <StatCard icon="💾" label="Saved Jobs" value={stats.saved} color="#10b981" />
        <StatCard icon="👤" label="Profile Score" value={`${stats.profile}%`} color="#f59e0b" />
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm"
      >
        <h2 className="text-base font-semibold text-neutral-900 mb-4">Recent Activity</h2>
        <div className="space-y-0">
          {activities.length > 0 ? (
            activities.map((activity, i) => (
              <RecentActivityCard key={i} activity={activity} />
            ))
          ) : (
            <p className="text-sm text-neutral-400 text-center py-6">No recent activity</p>
          )}
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-6"
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h3 className="font-semibold text-neutral-900">Pro Tip</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Complete your profile to increase your chances of being discovered by recruiters. You're {stats.profile}% complete.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
