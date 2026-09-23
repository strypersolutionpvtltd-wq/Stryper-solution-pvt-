import SEO               from '@/components/shared/SEO';
import Hero              from '@/components/hero/Hero';
import AboutPreview      from '@/components/about/AboutPreview';
import ServicesSection   from '@/components/services/ServicesSection';
import IndustriesSection from '@/components/industries/IndustriesSection';
import WhyChooseUs       from '@/components/about/WhyChooseUs';
import ProcessSection    from '@/components/about/ProcessSection';
import Testimonials      from '@/components/testimonials/Testimonials';
import CTASection        from '@/components/shared/CTASection';

/**
 * Home Page - all sections composed in visual order with primary SEO tags.
 */
const Home = () => (
  <>
    <SEO
      title="Stryper Solution Pvt Ltd | Recruitment & Staffing Agency in Jaipur"
      description="Stryper Solution Pvt Ltd provides recruitment, staffing, manpower, HR consultancy and talent acquisition services for businesses in Jaipur, Rajasthan, Delhi NCR and across India."
      keywords="Stryper Solution, Stryper Solution Pvt Ltd, recruitment agency in Jaipur, recruitment consultancy in Jaipur, HR consultancy in Jaipur, staffing agency in Jaipur, manpower consultancy in Jaipur, recruitment company in Jaipur, placement consultancy in Jaipur, hiring agency in Jaipur, recruitment services in Jaipur, corporate recruitment agency, permanent staffing services, temporary staffing services, contract staffing agency, manpower recruitment agency, skilled manpower recruitment, workforce solutions, talent acquisition services, IT recruitment agency Jaipur, non IT recruitment agency Jaipur, manufacturing recruitment agency, sales recruitment agency Jaipur, hospitality recruitment agency Jaipur, hotel staff recruitment agency, construction manpower recruitment, HR recruitment services Jaipur, BPO recruitment agency Jaipur, recruitment agency Rajasthan, staffing agency Delhi NCR, recruitment consultancy Noida, recruitment agency Gurgaon, recruitment partner for businesses, bulk recruitment services in Jaipur, corporate hiring solutions Jaipur"
      canonicalUrl="https://strypersolution.com/"
    />
    <Hero />
    <ServicesSection />
    <IndustriesSection />
    <Testimonials />
    <AboutPreview />
    <WhyChooseUs />
    <ProcessSection />
    <CTASection />
  </>
);

export default Home;
