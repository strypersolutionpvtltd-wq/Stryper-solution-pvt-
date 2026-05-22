import { motion } from 'framer-motion';

import TestimonialCard from './TestimonialCard';
import { fadeInUp, staggerContainer, viewportOnce } from '@/utils/animations';

const TESTIMONIALS = [
  {
    id:          't1',
    name:        'Rajesh Mehta',
    role:        'Head of Operations',
    company:     'Apex Manufacturing Ltd.',
    quote:
      'Stryper Solution transformed our shop-floor staffing completely. Within 72 hours of our requirement, they had 40 trained workers on-site. The compliance documentation was flawless - our audit team was impressed.',
    rating:      5,
    avatarColor: '#7c3aed',
  },
  {
    id:          't2',
    name:        'Priya Sharma',
    role:        'VP - Supply Chain',
    company:     'NovaTrade Logistics',
    quote:
      'We\'ve worked with multiple staffing agencies over the years. Stryper stands apart because of their accountability. Every worker is tracked, every shift is reported, and their account manager is always reachable.',
    rating:      5,
    avatarColor: '#d97706',
  },
  {
    id:          't3',
    name:        'Anil Verma',
    role:        'Facility Director',
    company:     'Greenfield Commercial Parks',
    quote:
      'Our facility management requirements are complex - multi-site, multi-shift, with strict SLAs. Stryper Solution handles it seamlessly. Their team feels like an extension of our own operations.',
    rating:      5,
    avatarColor: '#059669',
  },
];

/* Aggregate stats shown above the cards */
const TRUST_STATS = [
  { value: '50+',  label: 'Enterprise Clients'  },
  { value: '98%',  label: 'Satisfaction Rate'   },
  { value: '500+', label: 'Workers Deployed'    },
  { value: '10+',  label: 'Years of Excellence' },
];

const Testimonials = () => (
  <section
    className="relative overflow-hidden section-padding"
    aria-labelledby="testimonials-heading"
    style={{
      background: 'linear-gradient(180deg, #fafafa 0%, #f5f3ff 55%, #fafafa 100%)',
    }}
  >
    {/* Background blobs */}
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full
                      bg-brand-purple-100/40 blur-[110px]" />
      <div className="absolute -bottom-24 -right-24 w-[380px] h-[380px] rounded-full
                      bg-brand-gold-100/35 blur-[100px]" />
    </div>

    <div className="container-base relative z-10">

      {/* ── Header ── */}
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="text-center max-w-2xl mx-auto mb-12 lg:mb-14"
      >
        <motion.div variants={fadeInUp} className="mb-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                           bg-brand-purple-50 border border-brand-purple-100
                           text-brand-purple-700 text-xs font-semibold tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-purple-500" aria-hidden="true" />
            Client Testimonials
          </span>
        </motion.div>

        <motion.h2
          id="testimonials-heading"
          variants={fadeInUp}
          className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-4"
          style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.75rem)' }}
        >
          Trusted By Businesses{' '}
          <span className="text-gradient-brand">Across Multiple Industries</span>
        </motion.h2>

        <motion.div variants={fadeInUp} className="divider-brand mx-auto mb-5" />

        <motion.p variants={fadeInUp} className="text-neutral-500 text-[1.05rem] leading-relaxed">
          Don&apos;t take our word for it. Here&apos;s what our clients say about working
          with Stryper Solution Pvt. Ltd.
        </motion.p>
      </motion.div>

      {/* ── Trust stats strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12"
      >
        {TRUST_STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
            className="flex flex-col items-center justify-center py-5 px-4 rounded-2xl
                       bg-white border border-neutral-100 shadow-soft text-center"
          >
            <span className="text-2xl font-bold font-display text-brand-purple-600 leading-none mb-1">
              {s.value}
            </span>
            <span className="text-xs text-neutral-500 font-medium">{s.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Cards - desktop grid / mobile scroll ── */}
      {/* Mobile: horizontal scroll container */}
      <div className="lg:hidden -mx-4 px-4">
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.id} className="snap-start shrink-0 w-[85vw] max-w-[340px]">
              <TestimonialCard {...t} index={i} />
            </div>
          ))}
        </div>
        {/* Scroll indicator dots */}
        <div className="flex justify-center gap-1.5 mt-4" aria-hidden="true">
          {TESTIMONIALS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full bg-brand-purple-300 transition-all duration-200 ${
                i === 0 ? 'w-5' : 'w-1.5'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: 3-column grid */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={t.id} {...t} index={i} />
        ))}
      </div>

      {/* ── Bottom trust bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-wrap items-center justify-center gap-6 mt-12
                   pt-8 border-t border-neutral-200/60"
      >
        <p className="text-sm text-neutral-500">Recognised by industry bodies:</p>
        {['ISO 9001:2015', 'NASSCOM Member', 'CII Affiliated', 'MSME Registered'].map((badge) => (
          <span
            key={badge}
            className="px-4 py-1.5 rounded-full bg-white border border-neutral-200
                       text-xs font-semibold text-neutral-600 shadow-soft"
          >
            {badge}
          </span>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Testimonials;
