import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * ServiceCard - premium animated service card.
 * Props: icon (ReactNode), title, description, href, index (for stagger delay)
 */
const ServiceCard = ({ icon, title, description, href = '/services', index = 0 }) => (
  <motion.article
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
    whileHover={{ y: -6, transition: { duration: 0.22, ease: 'easeOut' } }}
    className="group relative flex flex-col bg-white rounded-3xl p-7
               border border-neutral-100 shadow-soft
               hover:shadow-strong hover:border-brand-purple-100
               transition-all duration-300 overflow-hidden cursor-default"
  >
    {/* Animated border glow on hover */}
    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100
                    transition-opacity duration-400 pointer-events-none"
         style={{
           background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(217,119,6,0.04) 100%)',
         }}
         aria-hidden="true"
    />

    {/* Gold accent line - bottom edge, slides in on hover */}
    <motion.div
      className="absolute bottom-0 left-6 right-6 h-[3px] rounded-t-full
                 bg-gradient-to-r from-brand-purple-500 to-brand-gold-400"
      initial={{ scaleX: 0 }}
      whileHover={{ scaleX: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ transformOrigin: 'left' }}
      aria-hidden="true"
    />

    {/* Icon */}
    <div className="relative mb-6 w-14 h-14 rounded-2xl flex items-center justify-center
                    bg-brand-purple-50 text-brand-purple-600
                    group-hover:bg-brand-purple-100
                    transition-colors duration-300">
      {icon}
      {/* Gold dot accent */}
      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full
                       bg-brand-gold-400 border-2 border-white
                       opacity-0 group-hover:opacity-100
                       transition-opacity duration-300"
            aria-hidden="true"
      />
    </div>

    {/* Content */}
    <h3 className="text-[1.05rem] font-display font-semibold text-neutral-900 mb-3 leading-snug">
      {title}
    </h3>
    <p className="text-sm text-neutral-500 leading-relaxed flex-1 mb-6">
      {description}
    </p>

    {/* Learn more link */}
    <Link
      to={href}
      className="inline-flex items-center gap-1.5 text-sm font-semibold
                 text-brand-purple-600 hover:text-brand-purple-800
                 transition-colors duration-200 group/link"
      aria-label={`Learn more about ${title}`}
    >
      Learn More
      <motion.svg
        width="14" height="14" viewBox="0 0 14 14" fill="none"
        aria-hidden="true"
        className="transition-transform duration-200 group-hover/link:translate-x-1"
      >
        <path d="M2.5 7h9M7.5 3l4 4-4 4"
              stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    </Link>
  </motion.article>
);

export default ServiceCard;
