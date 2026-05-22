import Hero              from '@/components/hero/Hero';
import AboutPreview      from '@/components/about/AboutPreview';
import ServicesSection   from '@/components/services/ServicesSection';
import IndustriesSection from '@/components/industries/IndustriesSection';
import WhyChooseUs       from '@/components/about/WhyChooseUs';
import ProcessSection    from '@/components/about/ProcessSection';
import Testimonials      from '@/components/testimonials/Testimonials';
import CTASection        from '@/components/shared/CTASection';

/**
 * Home Page - all sections composed in visual order.
 */
const Home = () => (
  <>
    <Hero />
    <AboutPreview />
    <ServicesSection />
    <IndustriesSection />
    <WhyChooseUs />
    <ProcessSection />
    <Testimonials />
    <CTASection />
  </>
);

export default Home;
