import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * IndustryCard - premium industry card with animated glow border.
 * Props: icon, title, description, href, index, accentColor ('purple'|'gold')
 */
const IndustryCard = ({ icon, title, description, href = '/industries', index = 0, accentColor = 'purple' }) => {
  const isGold = accentColor === 'gold';

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.48, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -5, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="group relative flex flex-col bg-white rounded-2xl p-6
                 border border-neutral-100 shadow-soft overflow-hidden
                 hover:shadow-medium cursor-default
                 transition-shadow duration-300"
    >
      {/* Hover background wash */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100
                   transition-opacity duration-350 pointer-events-none rounded-2xl"
        style={{
          background: isGold
            ? 'linear-gradient(135deg, rgba(217,119,6,0.04) 0%, rgba(124,58,237,0.03) 100%)'
            : 'linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(217,119,6,0.03) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Animated glow border — top edge */}
      <motion.div
        className={[
          'absolute top-0 left-5 right-5 h-[2px] rounded-b-full',
          isGold
            ? 'bg-gradient-to-r from-brand-gold-400 to-brand-gold-300'
            : 'bg-gradient-to-r from-brand-purple-500 to-brand-gold-400',
        ].join(' ')}
        initial={{ scaleX: 0, opacity: 0 }}
        whileHover={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        style={{ transformOrigin: 'center' }}
        aria-hidden="true"
      />

      {/* Icon */}
      <div
        className={[
          'relative mb-5 w-12 h-12 rounded-xl flex items-center justify-center',
          'transition-colors duration-250',
          isGold
            ? 'bg-brand-gold-50 text-brand-gold-600 group-hover:bg-brand-gold-100'
            : 'bg-brand-purple-50 text-brand-purple-600 group-hover:bg-brand-purple-100',
        ].join(' ')}
      >
        {icon}
      </div>

      {/* Text */}
      <h3 className="text-[0.95rem] font-display font-semibold text-neutral-900 mb-2 leading-snug">
        {title}
      </h3>
      <p className="text-sm text-neutral-500 leading-relaxed flex-1 mb-5">
        {description}
      </p>

      {/* Explore link */}
      <Link
        to={href}
        className={[
          'inline-flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200',
          isGold
            ? 'text-brand-gold-600 hover:text-brand-gold-700'
            : 'text-brand-purple-600 hover:text-brand-purple-800',
        ].join(' ')}
        aria-label={`Explore ${title}`}
      >
        Explore
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        >
          <path d="M2 6h8M6.5 2.5l3.5 3.5-3.5 3.5"
                stroke="currentColor" strokeWidth="1.4"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </motion.article>
  );
};

export default IndustryCard;
