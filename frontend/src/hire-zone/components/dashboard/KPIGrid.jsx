import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { staggerContainer } from '@/utils/animations';
import KPICard from './KPICard';
import { dashboard } from '@/utils/api';

const KPIGrid = () => {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await dashboard.getCompany();
        const d = res.data?.dashboard || {};
        setKpis([
          { id: 'total-jobs',  title: 'Total Jobs',           value: d.totalJobs || 0,           trend: '+0', trendDirection: 'up',   icon: 'briefcase', accentColor: 'purple' },
          { id: 'active-jobs', title: 'Active Hiring',        value: Array.isArray(d.activeJobs) ? d.activeJobs.length : (d.activeJobs || 0), trend: '+0', trendDirection: 'up', icon: 'zap', accentColor: 'green' },
          { id: 'applicants',  title: 'Total Applicants',     value: d.totalApplications || 0,   trend: '+0', trendDirection: 'up',   icon: 'users',     accentColor: 'blue'   },
          { id: 'shortlisted', title: 'Shortlisted',          value: d.shortlisted || 0,         trend: '+0', trendDirection: 'up',   icon: 'star',      accentColor: 'gold'   },
          { id: 'interviews',  title: 'Interviews Scheduled', value: d.upcomingInterviews || 0,  trend: '+0', trendDirection: 'up',   icon: 'calendar',  accentColor: 'orange' },
          { id: 'hired',       title: 'Hired',                value: d.hiredCount || 0,          trend: '+0', trendDirection: 'up',   icon: 'check',     accentColor: 'teal'   },
        ]);
      } catch (err) {
        console.error('KPI fetch failed:', err);
        setKpis([
          { id: 'total-jobs',  title: 'Total Jobs',           value: 0, trend: '', trendDirection: 'up', icon: 'briefcase', accentColor: 'purple' },
          { id: 'active-jobs', title: 'Active Hiring',        value: 0, trend: '', trendDirection: 'up', icon: 'zap',       accentColor: 'green'  },
          { id: 'applicants',  title: 'Total Applicants',     value: 0, trend: '', trendDirection: 'up', icon: 'users',     accentColor: 'blue'   },
          { id: 'shortlisted', title: 'Shortlisted',          value: 0, trend: '', trendDirection: 'up', icon: 'star',      accentColor: 'gold'   },
          { id: 'interviews',  title: 'Interviews Scheduled', value: 0, trend: '', trendDirection: 'up', icon: 'calendar',  accentColor: 'orange' },
          { id: 'hired',       title: 'Hired',                value: 0, trend: '', trendDirection: 'up', icon: 'check',     accentColor: 'teal'   },
        ]);
      } finally {
        setLoading(false);
      }
    })();
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
