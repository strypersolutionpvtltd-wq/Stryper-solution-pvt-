import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHero from '@/components/shared/PageHero';
import { fadeInUp, staggerContainer, viewportOnce } from '@/utils/animations';
import img6 from '@/assets/image/6.jpeg';

const FacilityManagement = () => {
  return (
    <>
      <PageHero
        title="Facility Management"
        subtitle="Taking care of your facilities with cleaning, security, maintenance, and other support services."
        breadcrumb="Facility Management"
        image={img6}
      />
      
      <section className="section-padding bg-white">
        <div className="container-base max-w-4xl">
          <motion.div variants={staggerContainer(0.1)} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-neutral-900 mb-6 font-display">
              Complete Facility Support
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-neutral-600 leading-relaxed mb-6 text-lg">
              We take care of all aspects of facility support, from everyday cleaning to complex technical maintenance. Our supervised teams work in all sorts of places: commercial buildings, corporate offices, hospitals, and industrial sites. We ensure your environment remains clean, safe, and fully operational.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="bg-brand-purple-50 rounded-2xl p-8 mb-8 border border-brand-purple-100">
              <h3 className="text-xl font-bold text-neutral-900 mb-5">Our Expertise Includes:</h3>
              <ul className="grid sm:grid-cols-2 gap-4">
                {[
                  "Housekeeping Staff",
                  "Office Support Personnel",
                  "Deep Cleaning Services",
                  "Electrical & Plumbing Support",
                  "Commercial Facility Services",
                  "Security Personnel"
                ].map(item => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-purple-200 text-brand-purple-700 flex items-center justify-center text-sm font-bold">✓</span>
                    <span className="text-neutral-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 pt-6">
                <Link to="/contact" className="px-8 py-3.5 bg-brand-purple-600 text-white font-bold rounded-xl shadow-lg shadow-brand-purple-600/20 hover:bg-brand-purple-700 transition-colors">
                  Get a Free Consultation
                </Link>
                <Link to="/services" className="px-8 py-3.5 bg-white border border-neutral-200 text-neutral-700 font-bold rounded-xl hover:bg-neutral-50 transition-colors">
                  View All Services
                </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default FacilityManagement;
