import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer } from '@/utils/animations';
import { dashboard } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import KPIGrid from '@/hire-zone/components/dashboard/KPIGrid';
import HiringChart from '@/hire-zone/components/dashboard/HiringChart';
import RecentApplications from '@/hire-zone/components/dashboard/RecentApplications';
import QuickActions from '@/hire-zone/components/dashboard/QuickActions';
import UpcomingInterviews from '@/hire-zone/components/dashboard/UpcomingInterviews';
import ActiveJobsWidget from '@/hire-zone/components/dashboard/ActiveJobsWidget';
import HiringPipeline from '@/hire-zone/components/dashboard/HiringPipeline';

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const greetingByHour = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const Dashboard = () => {
  const { userData } = useAuth();
  const [stats, setStats] = useState({ activeJobs: 0, totalApplications: 0, hiredCount: 0, pendingReview: 0, upcomingInterviews: 0 });

  useEffect(() => {
    (async () => {
      try {
        const res = await dashboard.getCompany();
        const d = res.data?.dashboard || {};
        setStats({
          activeJobs:          Array.isArray(d.activeJobs) ? d.activeJobs.length : (d.activeJobs || 0),
          totalApplications:   d.totalApplications || 0,
          hiredCount:          d.hiredCount || 0,
          pendingReview:       d.pendingReview || 0,
          upcomingInterviews:  d.upcomingInterviews || 0,
        });
      } catch (err) {
        console.error('Dashboard banner fetch error:', err);
      }
    })();
  }, []);

  const companyName = userData?.companyName || userData?.name || userData?.email?.split('@')[0] || 'Company';

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">

      {/* Welcome banner */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible"
        className="rounded-2xl p-6 flex items-center justify-between overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #8B3A8F 0%, #6d2b71 60%, #4a1a4d 100%)' }}>
        <div className="relative z-10">
          <p className="text-purple-200 text-sm font-medium mb-1">{greetingByHour()} 👋</p>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {companyName}</h1>
          <p className="text-purple-200 text-sm">
            {stats.pendingReview > 0
              ? <>You have <span className="text-white font-semibold">{stats.pendingReview} pending</span> applications to review.</>
              : 'Your hiring dashboard is ready.'}
          </p>
        </div>
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -right-4 -bottom-10 w-56 h-56 rounded-full bg-white/5" />
        <div className="hidden sm:flex items-center gap-2 md:gap-3 relative z-10">
          <div className="text-center px-3 md:px-5 py-2 md:py-3 rounded-xl bg-white/10 backdrop-blur-sm">
            <p className="text-xl md:text-2xl font-bold text-white">{stats.activeJobs}</p>
            <p className="text-[10px] md:text-xs text-purple-200">Active Jobs</p>
          </div>
          <div className="text-center px-3 md:px-5 py-2 md:py-3 rounded-xl bg-white/10 backdrop-blur-sm">
            <p className="text-xl md:text-2xl font-bold text-white">{stats.totalApplications}</p>
            <p className="text-[10px] md:text-xs text-purple-200">Applicants</p>
          </div>
          <div className="text-center px-3 md:px-5 py-2 md:py-3 rounded-xl bg-white/10 backdrop-blur-sm">
            <p className="text-xl md:text-2xl font-bold text-white">{stats.hiredCount}</p>
            <p className="text-[10px] md:text-xs text-purple-200">Hired</p>
          </div>
        </div>
      </motion.div>

      {/* KPI cards */}
      <motion.div variants={staggerContainer(0.07)} initial="hidden" animate="visible">
        <KPIGrid />
      </motion.div>

      {/* Row 2: Chart + Quick Actions */}
      <motion.div variants={staggerContainer(0.08, 0.1)} initial="hidden" animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div variants={fadeUp} className="lg:col-span-2"><HiringChart /></motion.div>
        <motion.div variants={fadeUp}><QuickActions /></motion.div>
      </motion.div>

      {/* Row 3: Active Jobs + Pipeline + Interviews */}
      <motion.div variants={staggerContainer(0.08, 0.15)} initial="hidden" animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <motion.div variants={fadeUp}><ActiveJobsWidget /></motion.div>
        <motion.div variants={fadeUp}><HiringPipeline /></motion.div>
        <motion.div variants={fadeUp}><UpcomingInterviews /></motion.div>
      </motion.div>

      {/* Row 4: Recent Applications */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
        <RecentApplications />
      </motion.div>
    </div>
  );
};

export default Dashboard;
