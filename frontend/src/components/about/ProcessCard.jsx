import { motion } from 'framer-motion';

/**
 * ProcessCard — numbered step card for the work process timeline.
 * Props: step (number), icon, title, description, index, isLast
 */
const ProcessCard = ({ step, icon, title, description, index = 0, isLast = false }) => (
  <div className="relative flex flex-col items-center">

    {/* Connector line — hidden on last card */}
    {!isLast && (
      <div className="hidden lg:block absolute top-[52px] left-[calc(50%+52px)] right-0 h-[2px] z-0">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-purple-200 to-brand-purple-100"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.3 + index * 0.15, ease: 'easeOut' }}
          style={{ transformOrigin: 'left' }}
        />
        {/* Arrow head */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-px">
          <svg width="8" height="10" viewBox="0 0 8 10" fill="none" aria-hidden="true">
            <path d="M1 1l6 4-6 4" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    )}

    {/* Card */}
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: 'easeOut' }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative w-full flex flex-col items-center text-center
                 bg-white rounded-3xl px-6 pt-8 pb-7
                 border border-neutral-100 shadow-soft
                 hover:shadow-medium hover:border-brand-purple-100
                 transition-all duration-300 overflow-hidden z-10"
    >
      {/* Hover wash */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100
                   transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(160deg, rgba(124,58,237,0.04) 0%, rgba(217,119,6,0.03) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Step number — top right corner */}
      <span
        className="absolute top-4 right-5 text-[11px] font-bold tracking-widest
                   text-brand-purple-200 group-hover:text-brand-purple-300
                   transition-colors duration-200 font-sans"
        aria-hidden="true"
      >
        {String(step).padStart(2, '0')}
      </span>

      {/* Numbered icon ring */}
      <div className="relative mb-6">
        {/* Outer ring */}
        <div className="w-[104px] h-[104px] rounded-full border-2 border-dashed border-brand-purple-100
                        group-hover:border-brand-purple-200 transition-colors duration-300
                        flex items-center justify-center">
          {/* Inner filled circle */}
          <motion.div
            className="w-[76px] h-[76px] rounded-full bg-gradient-to-br
                       from-brand-purple-600 to-brand-purple-500
                       flex items-center justify-center text-white shadow-purple
                       group-hover:from-brand-purple-700 group-hover:to-brand-purple-600
                       transition-all duration-300"
            whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
          >
            {icon}
          </motion.div>
        </div>

        {/* Gold step badge */}
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full
                        bg-brand-gold-500 border-2 border-white
                        flex items-center justify-center
                        text-white text-[10px] font-bold shadow-gold">
          {step}
        </div>
      </div>

      {/* Text */}
      <h3 className="text-[0.95rem] font-display font-semibold text-neutral-900 mb-2.5 leading-snug">
        {title}
      </h3>
      <p className="text-sm text-neutral-500 leading-relaxed">
        {description}
      </p>
    </motion.article>
  </div>
);

export default ProcessCard;
