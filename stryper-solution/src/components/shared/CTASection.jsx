import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer, viewportOnce } from '@/utils/animations';

/**
 * CTASection - full-width pre-footer call-to-action banner.
 * Purple dominant with gold accents and animated ambient glow.
 */
const CTASection = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* ── Deep purple gradient base ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #2e1065 0%, #4c1d95 35%, #5b21b6 65%, #3b0764 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── Animated ambient orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Gold orb - top right */}
        <motion.div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full
                     bg-brand-gold-500/20 blur-[100px]"
          animate={reduceMotion ? {} : {
            scale:   [1, 1.12, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Purple orb - bottom left */}
        <motion.div
          className="absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full
                     bg-brand-purple-400/25 blur-[90px]"
          animate={reduceMotion ? {} : {
            scale:   [1, 1.08, 1],
            opacity: [0.25, 0.35, 0.25],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="container-sm relative z-10 py-24 lg:py-32">
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-col items-center text-center"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeInUp} className="mb-7">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                             bg-white/10 border border-white/20 backdrop-blur-sm
                             text-white/80 text-xs font-semibold tracking-wide uppercase">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-brand-gold-400"
                animate={reduceMotion ? {} : { opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                aria-hidden="true"
              />
              Take the Next Step
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            id="cta-heading"
            variants={fadeInUp}
            className="font-display font-bold text-white leading-[1.08] tracking-tight mb-6 text-balance"
            style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.75rem)' }}
          >
            Ready To Build A{' '}
            <span
              className="relative inline-block"
              style={{
                background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Stronger Workforce?
            </span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-white/65 text-lg leading-relaxed max-w-xl mb-10"
          >
            Partner with Stryper Solution Pvt. Ltd. for scalable staffing and
            operational excellence - delivered with precision, compliance, and care.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl
                           bg-brand-gold-500 text-white text-base font-semibold
                           shadow-gold hover:bg-brand-gold-600 hover:shadow-strong
                           transition-all duration-250"
              >
                Get Consultation
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M8.5 4l4 4-4 4"
                        stroke="currentColor" strokeWidth="1.7"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl
                           bg-white/10 text-white text-base font-semibold
                           border border-white/25 hover:bg-white/20 backdrop-blur-sm
                           transition-all duration-250"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 4.5C2 3.67 2.67 3 3.5 3h9C13.33 3 14 3.67 14 4.5v7c0 .83-.67 1.5-1.5 1.5h-9C2.67 13 2 12.33 2 11.5v-7z"
                        stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 5l6 4 6-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Contact Team
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust micro-row */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
          >
            {[
              { icon: '✓', text: 'No commitment required'   },
              { icon: '✓', text: 'Response within 24 hours' },
              { icon: '✓', text: 'Free initial consultation' },
            ].map((item) => (
              <span key={item.text} className="flex items-center gap-2 text-sm text-white/55">
                <span className="text-brand-gold-400 font-bold text-base leading-none">
                  {item.icon}
                </span>
                {item.text}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Bottom wave divider into footer ── */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg
          viewBox="0 0 1440 40" fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-10"
        >
          <path
            d="M0 40V20C240 0 480 40 720 20C960 0 1200 40 1440 20V40H0Z"
            fill="#111827"
          />
        </svg>
      </div>
    </section>
  );
};

export default CTASection;
