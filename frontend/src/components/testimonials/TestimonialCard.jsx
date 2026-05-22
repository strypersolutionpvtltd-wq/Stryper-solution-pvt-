import { motion } from 'framer-motion';

/**
 * TestimonialCard
 * Props: name, role, company, quote, rating, avatarColor, index
 */
const TestimonialCard = ({ name, role, company, quote, rating = 5, avatarColor, index = 0 }) => (
  <motion.article
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.5, delay: index * 0.12, ease: 'easeOut' }}
    whileHover={{ y: -6, transition: { duration: 0.22, ease: 'easeOut' } }}
    className="group relative flex flex-col bg-white rounded-3xl p-7
               border border-neutral-100 shadow-soft
               hover:shadow-strong hover:border-brand-purple-100
               transition-all duration-300 overflow-hidden"
  >
    {/* Hover wash */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100
                 transition-opacity duration-350 pointer-events-none rounded-3xl"
      style={{
        background:
          'linear-gradient(145deg, rgba(124,58,237,0.04) 0%, rgba(217,119,6,0.03) 100%)',
      }}
      aria-hidden="true"
    />

    {/* Top: quote mark + stars */}
    <div className="flex items-start justify-between mb-6">
      {/* Decorative quotation mark */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0
                   bg-brand-purple-50 group-hover:bg-brand-purple-100
                   transition-colors duration-250"
        aria-hidden="true"
      >
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
          <path
            d="M0 16V9.6C0 4.267 2.933 1.067 8.8 0l1.2 1.6C7.2 2.4 5.467 4 5.067 6.4H8V16H0zm11.2 0V9.6C11.2 4.267 14.133 1.067 20 0l1.2 1.6c-2.8.8-4.533 2.4-4.933 4.8H19.2V16H11.2z"
            fill="#7c3aed"
            fillOpacity="0.5"
          />
        </svg>
      </div>

      {/* Star rating */}
      <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width="14" height="14" viewBox="0 0 14 14" fill="none"
            aria-hidden="true"
          >
            <path
              d="M7 1l1.5 3 3.3.5-2.4 2.3.6 3.3L7 8.5l-3 1.6.6-3.3L2.2 4.5l3.3-.5L7 1z"
              fill={i < rating ? '#d97706' : '#e5e7eb'}
            />
          </svg>
        ))}
      </div>
    </div>

    {/* Quote text */}
    <blockquote className="flex-1 mb-7">
      <p className="text-neutral-600 text-[0.95rem] leading-relaxed italic">
        &quot;{quote}&quot;
      </p>
    </blockquote>

    {/* Divider */}
    <div className="h-px bg-neutral-100 mb-5" aria-hidden="true" />

    {/* Author */}
    <div className="flex items-center gap-3.5">
      {/* Avatar */}
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center
                   text-white text-sm font-bold shrink-0 select-none"
        style={{ backgroundColor: avatarColor }}
        aria-hidden="true"
      >
        {name.charAt(0)}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-neutral-900 leading-none mb-1 truncate">
          {name}
        </p>
        <p className="text-xs text-neutral-500 truncate">
          {role}
          {company && (
            <span className="text-brand-purple-500 font-medium"> · {company}</span>
          )}
        </p>
      </div>

      {/* Verified badge */}
      <div className="ml-auto shrink-0">
        <div
          className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center"
          title="Verified client"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path
              d="M2.5 6.5l3 3 5-5"
              stroke="#10b981" strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  </motion.article>
);

export default TestimonialCard;
