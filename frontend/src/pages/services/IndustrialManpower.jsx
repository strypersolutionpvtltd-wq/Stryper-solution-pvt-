import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHero from '@/components/shared/PageHero';
import { fadeInUp, staggerContainer, viewportOnce } from '@/utils/animations';
import img2 from '@/assets/image/2.jpeg';

const IndustrialManpower = () => {
  return (
    <>
      <PageHero
        title="Industrial Manpower"
        subtitle="Skilled, semi-skilled, and entry-level workers for your factory, production lines, and plant operations."
        breadcrumb="Industrial Manpower"
        image={img2}
      />
      
      <section className="section-padding bg-white">
        <div className="container-base max-w-4xl">
          <motion.div variants={staggerContainer(0.1)} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-neutral-900 mb-6 font-display">
              Reliable Workers for Industry
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-neutral-600 leading-relaxed mb-6 text-lg">
              We send out trained and thoroughly checked industrial workers to manufacturing sites, production lines, and various plant settings. We have people with all sorts of skills, from technicians with ITI certifications to seasoned machine operators. Every person we send has a background check, their skills are tested, and they get training before they ever start working.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="bg-neutral-50 rounded-2xl p-8 mb-8 border border-neutral-100">
              <h3 className="text-xl font-bold text-neutral-900 mb-5">Our Expertise Includes:</h3>
              <ul className="grid sm:grid-cols-2 gap-4">
                {[
                  "Skilled Technicians & ITI Holders",
                  "Machine Operators",
                  "Production Workforce",
                  "Quality Inspection Staff",
                  "Diploma & Certified Workers",
                  "Assembly Line Workers"
                ].map(item => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-purple-100 text-brand-purple-600 flex items-center justify-center text-sm font-bold">✓</span>
                    <span className="text-neutral-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 pt-6">
                <Link to="/contact" className="px-8 py-3.5 bg-brand-purple-600 text-white font-bold rounded-xl shadow-lg shadow-brand-purple-600/20 hover:bg-brand-purple-700 transition-colors">
                  Get a Free Consultation
                </Link>
                <Link to="/contact" className="px-8 py-3.5 bg-white border border-neutral-200 text-neutral-700 font-bold rounded-xl hover:bg-neutral-50 transition-colors">
                  Talk to Us
                </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default IndustrialManpower;
