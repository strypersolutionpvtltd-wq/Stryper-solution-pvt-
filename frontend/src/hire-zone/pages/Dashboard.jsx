import { motion } from 'framer-motion';
import { staggerContainer } from '@/utils/animations';
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

const Dashboard = () => (
  <div className="p-6 max-w-[1400px] mx-auto space-y-6">

    {/* Welcome banner */}
    <motion.div
      variants={fadeUp} initial="hidden" animate="visible"
      className="rounded-2xl p-6 flex items-center justify-between overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #8B3A8F 0%, #6d2b71 60%, #4a1a4d 100%)' }}
    >
      <div className="relative z-10">
        <p className="text-purple-200 text-sm font-medium mb-1">Good morning 👋</p>
        <h1 className="text-2xl font-bold text-white mb-1">Welcome to Hire Zone</h1>
        <p className="text-purple-200 text-sm">You have <span className="text-white font-semibold">6 new applications</span> and <span className="text-white font-semibold">2 interviews</span> today.</p>
      </div>
      {/* Decorative circles */}
      <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" aria-hidden="true" />
      <div className="absolute -right-4 -bottom-10 w-56 h-56 rounded-full bg-white/5" aria-hidden="true" />
      <div className="hidden md:flex items-center gap-3 relative z-10">
        <div className="text-center px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm">
          <p className="text-2xl font-bold text-white">8</p>
          <p className="text-xs text-purple-200">Active Jobs</p>
        </div>
        <div className="text-center px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm">
          <p className="text-2xl font-bold text-white">142</p>
          <p className="text-xs text-purple-200">Applicants</p>
        </div>
        <div className="text-center px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm">
          <p className="text-2xl font-bold text-white">4</p>
          <p className="text-xs text-purple-200">Hired</p>
        </div>
      </div>
    </motion.div>

    {/* KPI cards */}
    <motion.div variants={staggerContainer(0.07)} initial="hidden" animate="visible">
      <KPIGrid />
    </motion.div>

    {/* Row 2: Chart (2/3) + Quick Actions (1/3) */}
    <motion.div
      variants={staggerContainer(0.08, 0.1)} initial="hidden" animate="visible"
      className="grid grid-cols-1 lg:grid-cols-3 gap-5"
    >
      <motion.div variants={fadeUp} className="lg:col-span-2">
        <HiringChart />
      </motion.div>
      <motion.div variants={fadeUp}>
        <QuickActions />
      </motion.div>
    </motion.div>

    {/* Row 3: Active Jobs + Pipeline + Interviews */}
    <motion.div
      variants={staggerContainer(0.08, 0.15)} initial="hidden" animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      <motion.div variants={fadeUp}>
        <ActiveJobsWidget />
      </motion.div>
      <motion.div variants={fadeUp}>
        <HiringPipeline />
      </motion.div>
      <motion.div variants={fadeUp}>
        <UpcomingInterviews />
      </motion.div>
    </motion.div>

    {/* Row 4: Recent Applications full width */}
    <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
      <RecentApplications />
    </motion.div>

  </div>
);

export default Dashboard;
