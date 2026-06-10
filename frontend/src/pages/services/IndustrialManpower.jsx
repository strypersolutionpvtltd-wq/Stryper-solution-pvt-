import React from 'react';
import { motion } from 'framer-motion';
import PageHero from '@/components/shared/PageHero';
import { fadeInUp, staggerContainer, viewportOnce } from '@/utils/animations';
import img5 from '@/assets/image/5.jpeg';

const PURPLE = "#8B3A8F";

const IndustrialManpower = () => {
  return (
    <div className="bg-white">
      <PageHero 
        title="Industrial Manpower" 
        subtitle="Reliable skilled and semi-skilled workforce for your industrial operations." 
        breadcrumb="Services / Industrial Manpower"
        image={img5}
      />
      
      <section className="section-padding">
        <div className="container-base">
          <motion.div 
            variants={staggerContainer(0.1)} 
            initial="hidden" 
            whileInView="visible" 
            viewport={viewportOnce}
            className="max-w-4xl mx-auto"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-6" style={{ color: PURPLE }}>
              Workforce Solutions for Manufacturing & Industry
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-neutral-600 mb-8 leading-relaxed">
              We find skilled, semi-skilled, and even entry-level workers for factories, production lines, and plant operations. 
              Everyone we send is thoroughly checked and ready to start. Our manpower solutions are designed to meet 
              the dynamic needs of modern industrial environments.
            </motion.p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <motion.div variants={fadeInUp} className="bg-neutral-50 p-8 rounded-3xl border border-neutral-100">
                <h3 className="text-xl font-bold mb-4">Our Expertise</h3>
                <ul className="space-y-3">
                  {["Skilled Technicians & ITI Holders", "Machine Operators", "Production Workforce", "Quality Inspection Staff", "Diploma & Certified Workers"].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ background: PURPLE }} />
                      <span className="text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="bg-neutral-50 p-8 rounded-3xl border border-neutral-100">
                <h3 className="text-xl font-bold mb-4">Why Choose Us</h3>
                <p className="text-neutral-600">
                  We specialize in rapid deployment and compliant staffing. Our rigorous background checks and 
                  skill verification processes ensure that you get the right talent for your specific operational requirements.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default IndustrialManpower;
