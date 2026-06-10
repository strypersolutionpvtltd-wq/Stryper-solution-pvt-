import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { staggerContainer } from '@/utils/animations';
import KPICard from './KPICard';
import { dashboard } from '@/utils/api';
import { KPI_DATA } from '@/hire-zone/data/mockDashboard';

const KPIGrid = () => {
  const [kpis, setKpis] = useState(KPI_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboard.getCompany();
        const data = res.data.data;
        
        // Map API response to KPI format
        setKpis([
          { id: 'total-jobs', title: 'Total Jobs', value: data.totalJobs || 0, trend: '+0', trendDirection: 'up', icon: 'briefcase', accentColor: 'purple' },
          { id: 'active-jobs', title: 'Active Hiring', value: data.activeJobs || 0, trend: '+0', trendDirection: 'up', icon: 'zap', accentColor: 'green' },
          { id: 'applicants', title: 'Total Applicants', value: data.totalApplications || 0, trend: '+0', trendDirection: 'up', icon: 'users', accentColor: 'blue' },
          { id: 'shortlisted', title: 'Shortlisted', value: data.shortlistedCount || 0, trend: '+0', trendDirection: 'up', icon: 'star', accentColor: 'gold' },
          { id: 'interviews', title: 'Interviews Scheduled', value: data.upcomingInterviews || 0, trend: '+0', trendDirection: 'up', icon: 'calendar', accentColor: 'orange' },
          { id: 'hired', title: 'Hired This Month', value: data.hiredCount || 0, trend: '+0', trendDirection: 'up', icon: 'check', accentColor: 'teal' },
        ]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Fallback to mock data on error
        setKpis(KPI_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <motion.div
      variants={staggerContainer(0.08, 0)}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {kpis.map((kpi) => (
        <motion.div
          key={kpi.id}
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }}
        >
          <KPICard {...kpi} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default KPIGrid;
