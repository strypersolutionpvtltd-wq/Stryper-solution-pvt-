import React from 'react';
import ServiceLandingTemplate from '@/components/shared/ServiceLandingTemplate';
import img6 from '@/assets/image/6.jpeg';

const CorporateHiringPage = () => {
  return (
    <ServiceLandingTemplate
      seoTitle="Corporate Recruitment Agency & Executive Search | Stryper Solution"
      seoDescription="Expert corporate hiring and executive recruitment services by Stryper Solution. Sourcing managerial, departmental, and leadership talent for growing businesses."
      seoKeywords="corporate recruitment agency, corporate recruitment services, executive recruitment agency, corporate hiring solutions Jaipur, leadership hiring Rajasthan, executive search firm India, talent acquisition company Jaipur"
      canonicalPath="/corporate-hiring"
      heroTitle="Corporate Recruitment & Executive Hiring"
      heroSubtitle="Strategic executive search and managerial recruitment designed to elevate corporate leadership and drive long-term business performance."
      heroImage={img6}
      breadcrumbLabel="Corporate Hiring"
      introHeading="Executive Search & Leadership Hiring for Enterprise Growth"
      introParagraph1="Stryper Solution Pvt Ltd delivers specialized corporate recruitment, executive search, and mid-to-senior management hiring for progressive enterprises in Jaipur, Delhi NCR, and nationwide. We identify transformational leaders who shape organizational culture and profitability."
      introParagraph2="Using confidential market mapping, structured competence evaluations, and deep industry networks, we secure high-impact executives who align with your long-term corporate vision."
      offerings={[
        {
          title: "Executive Search & C-Suite",
          description: "Confidential headhunting for Managing Directors, CEOs, CFOs, CTOs, and Vice Presidents who steer enterprise strategy.",
          features: ["Discreet & confidential process", "Detailed leadership track record analysis", "Board-level presentation"]
        },
        {
          title: "Mid-to-Senior Management",
          description: "Recruiting General Managers, Department Heads, Plant Heads, and Project Directors across core business verticals.",
          features: ["Cross-industry talent benchmarking", "Domain competence testing", "Cultural fitment assessment"]
        },
        {
          title: "Corporate Functional Hiring",
          description: "End-to-end recruitment for corporate headquarters roles including Finance, Legal, Compliance, Corporate Communications, and Strategy.",
          features: ["Specialized domain recruiters", "Structured interview scorecards", "Salary benchmarking insights"]
        },
        {
          title: "Startup & Scale-up Team Building",
          description: "Assembling foundational core leadership and multi-disciplinary teams for fast-scaling startups and funded ventures.",
          features: ["Fast-paced talent pipelining", "Equity & compensation structuring support", "High-ownership mindset check"]
        },
        {
          title: "Confidential Replacement Search",
          description: "Executing sensitive talent transitions without alerting internal teams or external competitors.",
          features: ["Strict NDA protocols", "Off-market talent targeting", "Zero operational disruption"]
        },
        {
          title: "Diversity & Inclusion Hiring",
          description: "Dedicated initiatives to build balanced, inclusive corporate teams with gender, regional, and skill diversity.",
          features: ["Inclusive talent sourcing", "Unbiased screening criteria", "Targeted outreach programs"]
        }
      ]}
      roles={[
        "Chief Executive Officers (CEOs)", "Chief Financial Officers (CFOs)", "Plant Heads / Factory Directors",
        "Vice Presidents of Sales", "Human Resources Directors", "Legal & Compliance Heads",
        "Operations Directors", "Chief Technology Officers (CTOs)", "General Managers",
        "Corporate Strategy Leads", "Supply Chain Directors", "Marketing Heads"
      ]}
      processSteps={[
        { title: "Strategic Briefing", description: "Understanding organizational goals, leadership style, key performance indicators, and compensation." },
        { title: "Target Market Mapping", description: "Conducting discreet market research to identify high-performing executives in relevant sectors." },
        { title: "Leadership Assessment", description: "In-depth evaluations of strategic thinking, crisis management, team leadership, and track records." },
        { title: "Offer Closure & Onboarding", description: "Facilitating confidential negotiations, executive notice buyouts, and smooth leadership transition." }
      ]}
      whyUs={[
        { title: "Discreet Confidentiality", desc: "Highest standards of discretion and NDAs throughout the executive search process." },
        { title: "High Retention Rate", desc: "Over 95% of our placed corporate leaders complete their multi-year tenures successfully." },
        { title: "Tailored Compensation Consulting", desc: "Expert guidance on current salary trends, retention bonuses, and executive incentives." }
      ]}
      faqs={[
        { q: "How do you maintain confidentiality during executive searches?", a: "We sign strict Non-Disclosure Agreements (NDAs), withhold client identity during initial outreach, and only share information with pre-qualified candidates." },
        { q: "What is the typical timeframe for an executive hiring assignment?", a: "Most mid-to-senior management searches present qualified shortlists within 2 to 3 weeks, depending on the niche specialization." },
        { q: "Do you handle salary negotiations for senior leadership roles?", a: "Yes, our executive search consultants assist in structuring attractive, market-aligned compensation packages including base, performance bonuses, and perks." }
      ]}
      relatedServices={[
        { label: "Recruitment Services", path: "/recruitment-services" },
        { label: "HR Consultancy", path: "/hr-consultancy" },
        { label: "IT Recruitment", path: "/it-recruitment" },
        { label: "Non-IT Recruitment", path: "/non-it-recruitment" }
      ]}
    />
  );
};

export default CorporateHiringPage;
