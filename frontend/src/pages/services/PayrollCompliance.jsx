import React from 'react';
import { motion } from 'framer-motion';
import PageHero from '@/components/shared/PageHero';
import { fadeInUp, staggerContainer, viewportOnce } from '@/utils/animations';
import img2 from '@/assets/image/2.jpeg';

const GOLD = "#F5A623";

const PayrollCompliance = () => {
  return (
    <div className="bg-white">
      <PageHero 
        title="Payroll & Compliance" 
        subtitle="Managing payroll and labor law requirements with precision." 
        breadcrumb="Services / Payroll & Compliance"
        image={img2}
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
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-6" style={{ color: GOLD }}>
              Payroll and Legal Compliance
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-neutral-600 mb-8 leading-relaxed">
              We manage the entire payroll process, from keeping track of attendance to paying salaries, 
              all while making sure we follow every legal requirement. You can stay prepared for audits, 
              as we handle all the tricky parts of labor laws for you.
            </motion.p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <motion.div variants={fadeInUp} className="bg-neutral-50 p-8 rounded-3xl border border-neutral-100">
                <h3 className="text-xl font-bold mb-4">Our Compliance Services</h3>
                <ul className="space-y-3">
                  {["Payroll Processing", "Attendance Management", "Contract Staffing Documentation", "Employee Documentation", "PF, ESI, PT, TDS Compliance"].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ background: GOLD }} />
                      <span className="text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="bg-neutral-50 p-8 rounded-3xl border border-neutral-100">
                <h3 className="text-xl font-bold mb-4">Peace of Mind</h3>
                <p className="text-neutral-600">
                  With a 100% compliance rate and zero audit failures, we ensure your business stays legal 
                  and your employees are paid accurately and on time, every time.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PayrollCompliance;
