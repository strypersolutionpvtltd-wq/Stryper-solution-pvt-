import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHero from '@/components/shared/PageHero';
import SEO from '@/components/shared/SEO';
import FAQSection from '@/components/shared/FAQSection';
import { fadeInUp, staggerContainer, viewportOnce } from '@/utils/animations';
import { COMPANY_INFO } from '@/data/companyInfo';

const PURPLE = '#8B3A8F';
const GOLD = '#F5A623';

/**
 * ServiceLandingTemplate — High-converting, SEO-optimized landing page template.
 */
const ServiceLandingTemplate = ({
  seoTitle,
  seoDescription,
  seoKeywords,
  canonicalPath,
  heroTitle,
  heroSubtitle,
  heroImage,
  breadcrumbLabel,
  introHeading,
  introParagraph1,
  introParagraph2,
  offerings = [],
  roles = [],
  processSteps = [],
  whyUs = [],
  faqs = [],
  relatedServices = [],
}) => {
  const canonicalUrl = `https://strypersolution.com${canonicalPath}`;

  // Structured Schema for this Service
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        'name': heroTitle,
        'provider': {
          '@type': 'EmploymentAgency',
          'name': 'Stryper Solution Pvt Ltd',
          'url': 'https://strypersolution.com',
          'telephone': COMPANY_INFO.phone,
          'email': COMPANY_INFO.email,
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Jaipur',
            'addressRegion': 'Rajasthan',
            'addressCountry': 'IN'
          }
        },
        'serviceType': heroTitle,
        'description': seoDescription,
        'areaServed': [
          { '@type': 'City', 'name': 'Jaipur' },
          { '@type': 'State', 'name': 'Rajasthan' },
          { '@type': 'City', 'name': 'Delhi' },
          { '@type': 'City', 'name': 'Gurugram' },
          { '@type': 'City', 'name': 'Noida' },
          { '@type': 'Country', 'name': 'India' }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://strypersolution.com/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Services',
            'item': 'https://strypersolution.com/services'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': breadcrumbLabel,
            'item': canonicalUrl
          }
        ]
      }
    ]
  };

  return (
    <div className="bg-white">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonicalUrl={canonicalUrl}
        schemaData={serviceSchema}
      />

      {/* Hero Header */}
      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
        breadcrumb={`Services / ${breadcrumbLabel}`}
        image={heroImage}
      />

      {/* ── Section 1: Overview & Intro ── */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="container-base">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div variants={staggerContainer(0.1)} initial="hidden" whileInView="visible" viewport={viewportOnce}>
              <motion.div variants={fadeInUp} className="mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase"
                      style={{ background: '#faf5fb', borderColor: '#e4d0e9', color: PURPLE }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: PURPLE }} />
                  {breadcrumbLabel}
                </span>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 leading-tight mb-6">
                {introHeading}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-neutral-600 text-lg leading-relaxed mb-4">
                {introParagraph1}
              </motion.p>
              {introParagraph2 && (
                <motion.p variants={fadeInUp} className="text-neutral-500 text-base leading-relaxed">
                  {introParagraph2}
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Key Offerings Grid */}
          {offerings.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {offerings.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-neutral-50 border border-neutral-100 rounded-2xl p-7 hover:border-brand-purple-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5 font-bold"
                         style={{ background: 'rgba(139,58,143,0.1)', color: PURPLE }}>
                      {item.icon || '✓'}
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-3">{item.title}</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed mb-4">{item.description}</p>
                  </div>
                  {item.features && (
                    <ul className="space-y-2 border-t border-neutral-200/60 pt-4 text-xs text-neutral-700 font-medium">
                      {item.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2">
                          <span className="text-emerald-500 font-bold">✓</span> {feat}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Section 2: Roles We Hire & Place ── */}
      {roles.length > 0 && (
        <section className="py-16 bg-neutral-900 text-white relative overflow-hidden">
          <div className="container-base relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-brand-gold-400 text-xs font-semibold uppercase tracking-wider mb-3">
                Talent Pool Expertise
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold">Roles & Profiles We Regularly Supply</h2>
              <p className="text-neutral-400 text-sm mt-3">From entry-level to specialized senior professionals across Jaipur, Rajasthan, and Pan-India.</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
              {roles.map((role, rIdx) => (
                <span
                  key={rIdx}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-neutral-200 hover:border-brand-purple-400 hover:text-white transition-all duration-200"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Section 3: 4-Step Hiring Process ── */}
      {processSteps.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-base">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl font-display font-bold text-neutral-900 mb-3">Our Transparent Hiring & Deployment Process</h2>
              <p className="text-neutral-500 text-base">Quick, compliant, and zero-friction execution designed for business agility.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, sIdx) => (
                <div key={sIdx} className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6 relative group hover:border-brand-purple-300 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-brand-purple-600 text-white flex items-center justify-center font-bold text-base mb-4 shadow-md">
                    {sIdx + 1}
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Section 4: Why Choose Stryper Solution ── */}
      {whyUs.length > 0 && (
        <section className="py-16 bg-neutral-50 border-t border-neutral-100">
          <div className="container-base">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 mb-3">Why Partner With Stryper Solution in Jaipur</h2>
              <p className="text-neutral-500 text-sm">Industry-tested workforce management, statutory compliance, and dedicated client service.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {whyUs.map((item, wIdx) => (
                <div key={wIdx} className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-soft">
                  <h3 className="text-base font-bold text-neutral-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Section 5: FAQs ── */}
      {faqs.length > 0 && (
        <div className="bg-white">
          <FAQSection customFaqs={faqs} title={`Frequently Asked Questions about ${breadcrumbLabel}`} />
        </div>
      )}

      {/* ── Section 6: Related Service Links ── */}
      {relatedServices.length > 0 && (
        <section className="py-12 bg-neutral-100/60 border-t border-neutral-200/60">
          <div className="container-base">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-6 text-center">Explore Other Specialized Services</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {relatedServices.map((rel, idx) => (
                <Link
                  key={idx}
                  to={rel.path}
                  className="px-4 py-2 bg-white rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:border-brand-purple-400 hover:text-brand-purple-700 transition-all shadow-sm"
                >
                  {rel.label} →
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Section 7: Bottom CTA ── */}
      <section className="py-20 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #3d1940 0%, #662a6b 45%, #8B3A8F 100%)' }}>
        <div className="container-base relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Ready to Scale Your Team with Zero Friction?
          </h2>
          <p className="text-white/80 text-base leading-relaxed mb-8">
            Contact Stryper Solution Pvt Ltd today. Let us tailor a recruitment and workforce staffing plan for your exact business requirements.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 rounded-xl text-white font-bold transition-all shadow-lg"
              style={{ background: GOLD }}
            >
              Get Free Consultation →
            </Link>
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="px-8 py-4 rounded-xl font-bold border border-white/30 text-white hover:bg-white/10 transition-all"
            >
              Call: {COMPANY_INFO.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceLandingTemplate;
