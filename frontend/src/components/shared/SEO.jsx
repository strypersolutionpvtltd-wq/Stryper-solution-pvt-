import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_TITLE = 'Stryper Solution Pvt Ltd | Recruitment & Staffing Agency in Jaipur';
const DEFAULT_DESC = 'Stryper Solution Pvt Ltd provides recruitment, staffing, manpower, HR consultancy and talent acquisition services for businesses in Jaipur, Rajasthan, Delhi NCR and across India.';
const DEFAULT_KEYWORDS = 'Stryper Solution, Stryper Solution Pvt Ltd, recruitment agency in Jaipur, recruitment consultancy in Jaipur, HR consultancy in Jaipur, staffing agency in Jaipur, manpower consultancy in Jaipur, recruitment company in Jaipur, placement consultancy in Jaipur, hiring agency in Jaipur, recruitment services in Jaipur, corporate recruitment agency, permanent staffing services, temporary staffing services, contract staffing agency, manpower recruitment agency, skilled manpower recruitment, workforce solutions, talent acquisition services, IT recruitment agency Jaipur, non IT recruitment agency Jaipur, manufacturing recruitment agency, sales recruitment agency Jaipur, hospitality recruitment agency Jaipur, hotel staff recruitment agency, construction manpower recruitment, HR recruitment services Jaipur, BPO recruitment agency Jaipur, recruitment agency Rajasthan, staffing agency Delhi NCR, recruitment consultancy Noida, recruitment agency Gurgaon, recruitment partner for businesses, bulk recruitment services in Jaipur, corporate hiring solutions Jaipur';
const SITE_URL = 'https://strypersolution.com';
const DEFAULT_IMAGE = 'https://strypersolution.com/logo.png';

/**
 * Reusable SEO Manager component.
 * Dynamically updates document title, meta tags, canonical URL,
 * OpenGraph, Twitter cards, and Schema.org JSON-LD structured data.
 */
const SEO = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  schemaData = null,
}) => {
  const location = useLocation();
  const currentUrl = canonicalUrl || `${SITE_URL}${location.pathname === '/' ? '' : location.pathname}`;

  useEffect(() => {
    // 1. Title
    document.title = title;

    // Helper to update or create meta tag
    const setMetaTag = (attrName, attrValue, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content || '');
    };

    // Helper for link tags (e.g. canonical)
    const setLinkTag = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Standard Meta
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMetaTag('name', 'author', 'Stryper Solution Pvt Ltd');
    setMetaTag('name', 'geo.region', 'IN-RJ');
    setMetaTag('name', 'geo.placename', 'Jaipur');

    // 3. Canonical Link
    setLinkTag('canonical', currentUrl);

    // 4. OpenGraph (Facebook, LinkedIn, WhatsApp)
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:site_name', 'Stryper Solution Pvt Ltd');
    setMetaTag('property', 'og:locale', 'en_IN');

    // 5. Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 6. JSON-LD Structured Data
    const defaultSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['EmploymentAgency', 'LocalBusiness'],
          '@id': 'https://strypersolution.com/#localbusiness',
          'name': 'Stryper Solution Pvt Ltd',
          'alternateName': ['Stryper Solution', 'Stryper Recruitment Agency Jaipur'],
          'url': 'https://strypersolution.com',
          'logo': 'https://strypersolution.com/logo.png',
          'image': 'https://strypersolution.com/logo.png',
          'description': description,
          'telephone': '+918448590303',
          'email': 'Strypersolutionpvtltd@gmail.com',
          'priceRange': '₹₹',
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Jaipur',
            'addressRegion': 'Rajasthan',
            'addressCountry': 'IN'
          },
          'geo': {
            '@type': 'GeoCoordinates',
            'latitude': 26.9124,
            'longitude': 75.7873
          },
          'areaServed': [
            { '@type': 'City', 'name': 'Jaipur' },
            { '@type': 'State', 'name': 'Rajasthan' },
            { '@type': 'City', 'name': 'Delhi' },
            { '@type': 'City', 'name': 'Gurugram' },
            { '@type': 'City', 'name': 'Noida' },
            { '@type': 'Country', 'name': 'India' }
          ],
          'sameAs': [
            'https://www.linkedin.com/company/stryper-solution-pvt-ltd'
          ],
          'openingHoursSpecification': [
            {
              '@type': 'OpeningHoursSpecification',
              'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              'opens': '09:00',
              'closes': '19:00'
            }
          ]
        },
        {
          '@type': 'WebSite',
          '@id': 'https://strypersolution.com/#website',
          'url': 'https://strypersolution.com',
          'name': 'Stryper Solution Pvt Ltd',
          'description': 'Recruitment, Staffing, Manpower & HR Consultancy in Jaipur, Rajasthan, Delhi NCR, and India',
          'publisher': { '@id': 'https://strypersolution.com/#localbusiness' }
        }
      ]
    };

    const finalSchema = schemaData ? schemaData : defaultSchema;
    let scriptElement = document.getElementById('dynamic-seo-schema');
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = 'dynamic-seo-schema';
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(finalSchema);

  }, [title, description, keywords, currentUrl, ogImage, ogType, schemaData]);

  return null;
};

export default SEO;
