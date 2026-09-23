import React from 'react';
import ServiceLandingTemplate from '@/components/shared/ServiceLandingTemplate';
import img2 from '@/assets/image/2.jpeg';

const HospitalityRecruitmentPage = () => {
  return (
    <ServiceLandingTemplate
      seoTitle="Hotel & Hospitality Recruitment Agency Jaipur | Stryper Solution"
      seoDescription="Specialized hotel & hospitality recruitment agency in Jaipur. Supplying trained hotel staff, chefs, front office, F&B service, and resort housekeeping across Rajasthan & India."
      seoKeywords="hospitality recruitment agency Jaipur, hotel staff recruitment agency, resort staff hiring Rajasthan, F&B staff recruitment, hotel management hiring Jaipur, restaurant staff recruitment, hospitality workforce solutions"
      canonicalPath="/hospitality-recruitment"
      heroTitle="Hotel & Hospitality Recruitment in Jaipur"
      heroSubtitle="Trained and guest-ready staff for luxury hotels, heritage resorts, fine dining restaurants, and banquet operations."
      heroImage={img2}
      breadcrumbLabel="Hospitality Recruitment"
      introHeading="Guest-Ready Workforce for Hotels, Resorts & Restaurants"
      introParagraph1="Rajasthan and Jaipur are world-renowned hubs for luxury tourism, destination weddings, and heritage hospitality. Stryper Solution Pvt Ltd is a premier hospitality recruitment agency in Jaipur providing trained front-of-house, kitchen, and housekeeping talent."
      introParagraph2="We cater to 5-star properties, boutique resorts, cafe chains, banquet venues, and catering businesses, delivering groomed, disciplined, and customer-centric hospitality professionals for permanent positions and seasonal event staffing."
      offerings={[
        {
          title: "Front Office & Guest Relations",
          description: "Groomed front desk executives, concierges, duty managers, and guest relationship officers with excellent communication skills.",
          features: ["Impeccable grooming & etiquette", "Hotel PMS software knowledge", "Multilingual capabilities"]
        },
        {
          title: "Food & Beverage (F&B) Service",
          description: "Captains, stewards, mixologists, baristas, banquet servers, and F&B supervisors trained in formal table service standards.",
          features: ["Table service & dining etiquette", "Beverage & cocktail knowledge", "Speed and hygiene standards"]
        },
        {
          title: "Culinary & Kitchen Team",
          description: "Executive chefs, sous chefs, Indian/Continental/Bakery CDP specialists, commis chefs, and kitchen stewards.",
          features: ["Culinary trade certifications", "Food safety & hygiene trained", "High-volume banquet experience"]
        },
        {
          title: "Housekeeping & Laundry",
          description: "Housekeeping supervisors, room attendants, public area cleaners, linen runners, and professional laundry operators.",
          features: ["Deep cleaning protocols", "Guest privacy training", "Chemical & equipment safety"]
        },
        {
          title: "Banquet & Event Staffing",
          description: "High-volume on-demand service staff for destination weddings, corporate conferences, exhibition stalls, and banquets.",
          features: ["Flexible hourly/daily billing", "Uniformed & briefed teams", "Rapid scalable deployment"]
        },
        {
          title: "Hotel Engineering & Maintenance",
          description: "HVAC technicians, electricians, plumbers, and maintenance supervisors keeping luxury resort facilities running without interruption.",
          features: ["24/7 emergency response capability", "Preventive maintenance focus", "Guest area sensitivity"]
        }
      ]}
      roles={[
        "Front Desk Associates", "F&B Stewards & Captains", "Sous Chefs & Commis",
        "Housekeeping Room Attendants", "Guest Relations Executives", "Duty Managers",
        "Baristas & Bartenders", "Kitchen Stewarding Staff", "Banquet Coordinators",
        "Hotel Electricians & Plumbers", "Spa Therapists", "Concierge Executives"
      ]}
      processSteps={[
        { title: "Property Standards Assessment", description: "Understanding property rating, service standards, shift timings, and uniform protocols." },
        { title: "Grooming & Background Check", description: "Evaluating grooming, spoken communication, hospitality experience, and police verification." },
        { title: "Trial & Demonstration", description: "Arranging food tasting, table setup trials, or mock front-desk scenarios for critical positions." },
        { title: "Deployment & Shift Handover", description: "Ensuring smooth arrival, briefing, and shift integration at the hotel or resort." }
      ]}
      whyUs={[
        { title: "Deep Hospitality Domain Network", desc: "Access to hotel management graduates and experienced luxury resort staff across Rajasthan." },
        { title: "Peak Season Support", desc: "Reliable workforce surge support during the busy tourist and wedding season (October to March)." },
        { title: "Rigorous Grooming Standards", desc: "Every candidate is evaluated on grooming, hygiene, behavioral etiquette, and guest courtesy." }
      ]}
      faqs={[
        { q: "What types of hospitality properties do you staff in Rajasthan?", a: "We provide staff for 5-star and 4-star hotels, luxury heritage resorts, boutique stays, restaurant chains, cafes, banquets, and destination wedding venues." },
        { q: "Can you provide temporary banquet and event staff for weddings in Jaipur?", a: "Yes, we deploy trained F&B stewards, service captains, and housekeeping teams for destination weddings, conventions, and corporate banquets." },
        { q: "Are hospitality candidates background-verified?", a: "Yes, all candidates undergo strict ID, reference, background, and police verification before deployment." }
      ]}
      relatedServices={[
        { label: "Recruitment Services", path: "/recruitment-services" },
        { label: "Corporate Hiring", path: "/corporate-hiring" },
        { label: "Staffing Agency", path: "/staffing" },
        { label: "Facility Management", path: "/services/facility-management" }
      ]}
    />
  );
};

export default HospitalityRecruitmentPage;
