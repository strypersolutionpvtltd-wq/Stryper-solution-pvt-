import React from 'react';
import { motion } from 'framer-motion';
import PageHero from '@/components/shared/PageHero';
import { fadeInUp, staggerContainer, viewportOnce } from '@/utils/animations';
import img5 from '@/assets/image/5.jpeg';

const PURPLE = "#8B3A8F";

const FacilityManagement = () => {
  return (
    <div className="bg-white">
      <PageHero 
        title="Facility Management" 
        subtitle="Comprehensive support for cleaning, maintenance, and security." 
        breadcrumb="Services / Facility Management"
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
              Taking Care of Your Facilities
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-neutral-600 mb-8 leading-relaxed">
              We take care of all aspects of facility support, from everyday cleaning to complex technical maintenance. 
              Our supervised teams work in commercial buildings, corporate offices, hospitals, and industrial sites, 
              ensuring everything runs smoothly.
            </motion.p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <motion.div variants={fadeInUp} className="bg-neutral-50 p-8 rounded-3xl border border-neutral-100">
                <h3 className="text-xl font-bold mb-4">Our Services</h3>
                <ul className="space-y-3">
                  {["Housekeeping Staff", "Office Support Personnel", "Deep Cleaning Services", "Electrical & Plumbing Support", "Commercial Facility Services"].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ background: PURPLE }} />
                      <span className="text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="bg-neutral-50 p-8 rounded-3xl border border-neutral-100">
                <h3 className="text-xl font-bold mb-4">Quality & Reliability</h3>
                <p className="text-neutral-600">
                  With over 80+ facility clients, we maintain 100% SLA compliance. Our staff are trained, supervised, 
                  and equipped to deliver top-notch facility management services tailored to your environment.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FacilityManagement;
