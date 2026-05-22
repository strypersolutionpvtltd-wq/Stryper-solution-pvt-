import { motion } from 'framer-motion';
import { staggerContainer } from '@/utils/animations';
import KPICard from './KPICard';
import { KPI_DATA } from '@/hire-zone/data/mockDashboard';

const KPIGrid = () => (
  <motion.div
    variants={staggerContainer(0.08, 0)}
    initial="hidden"
    animate="visible"
    className="grid grid-cols-2 lg:grid-cols-3 gap-4"
  >
    {KPI_DATA.map((kpi) => (
      <motion.div
        key={kpi.id}
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }}
      >
        <KPICard {...kpi} />
      </motion.div>
    ))}
  </motion.div>
);

export default KPIGrid;
