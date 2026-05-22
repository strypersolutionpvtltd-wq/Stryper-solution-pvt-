import { motion } from 'framer-motion';

const StatCard = ({ stat, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.75 + index * 0.08, ease: 'easeOut' }}
    whileHover={{ y: -3, transition: { duration: 0.18 } }}
    className="group relative flex items-center gap-3.5 px-5 py-4 rounded-xl bg-white border border-neutral-100 shadow-soft hover:shadow-medium transition-all duration-300 cursor-default overflow-hidden"
  >
    {/* Hover wash */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
         style={{ background: 'linear-gradient(135deg, rgba(139,58,143,0.04) 0%, rgba(245,166,35,0.03) 100%)' }} />

    {/* Icon */}
    <div className="relative shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300"
         style={{ background: '#faf5fb', color: '#8B3A8F' }}>
      {stat.icon}
    </div>

    {/* Text */}
    <div className="relative min-w-0">
      <p className="text-xl font-bold font-display text-neutral-900 leading-none mb-0.5">{stat.value}</p>
      <p className="text-xs text-neutral-500 font-medium leading-tight truncate">{stat.label}</p>
    </div>

    {/* Gold accent left edge on hover */}
    <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
         style={{ background: '#F5A623' }} />
  </motion.div>
);

export default StatCard;
