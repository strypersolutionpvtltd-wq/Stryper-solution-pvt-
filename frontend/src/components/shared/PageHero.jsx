import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * PageHero - reusable inner-page hero banner.
 * Props:
 *   title, subtitle, breadcrumb - content
 *   image - optional imported image asset; when provided shows full-width photo
 *           with dark overlay (ShaleenJobs style), otherwise uses purple gradient
 */
const PageHero = ({ title, subtitle, breadcrumb, image }) => {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        paddingTop: '104px', /* top-bar (36px) + navbar (68px) */
        minHeight: image ? '380px' : undefined,
        background: image ? undefined : 'linear-gradient(135deg, #3d1940 0%, #662a6b 45%, #8B3A8F 100%)',
      }}
      aria-label={`${breadcrumb} page hero`}
    >
      {/* ── Background image (when provided) ── */}
      {image && (
        <>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Gradient overlay - left heavy so text stays readable */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(30,10,50,0.82) 0%, rgba(60,20,80,0.65) 55%, rgba(30,10,50,0.45) 100%)' }}
            aria-hidden="true"
          />
        </>
      )}

      {/* ── Decorative blobs (gradient mode only) ── */}
      {!image && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-20"
               style={{ background: '#F5A623' }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-20"
               style={{ background: '#8B3A8F' }} />
        </div>
      )}

      {/* ── Content ── */}
      <div className="container-base relative z-10 py-16 lg:py-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex items-center gap-2 text-sm text-white/50">
            <li>
              <Link to="/" className="hover:text-white transition-colors duration-200">Home</Link>
            </li>
            <li aria-hidden="true" className="text-white/30">/</li>
            <li className="text-white/80" aria-current="page">{breadcrumb}</li>
          </ol>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          {/* Eyebrow */}
          <span
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
            style={{ background: 'rgba(245,166,35,0.2)', border: '1px solid rgba(245,166,35,0.35)', color: '#fbbf24' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" aria-hidden="true" />
            {breadcrumb}
          </span>

          <h1
            className="font-display font-bold text-white leading-[1.08] tracking-tight mb-4 text-balance"
            style={{ fontSize: 'clamp(1.9rem, 3.8vw, 3rem)', textShadow: image ? '0 2px 16px rgba(0,0,0,0.4)' : 'none' }}
          >
            {title}
          </h1>

          {subtitle && (
            <p className="text-white/70 text-lg leading-relaxed max-w-xl">{subtitle}</p>
          )}
        </motion.div>
      </div>

      {/* ── Bottom wave into page ── */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg viewBox="0 0 1440 32" fill="none" preserveAspectRatio="none" className="w-full h-8">
          <path d="M0 32V16C360 0 720 32 1080 16C1260 8 1380 24 1440 16V32H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
};

export default PageHero;
