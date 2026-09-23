/**
 * Route configuration map.
 * Used by Navbar, Footer, and sitemap generation.
 */
export const NAV_ROUTES = [
  { label: 'Home',       path: '/',           exact: true  },
  { label: 'Services',   path: '/services',   exact: false },
  { label: 'Industries', path: '/industries', exact: false },
  { label: 'Careers',    path: '/careers',    exact: false },
  { label: 'About',      path: '/about',      exact: false },
  { label: 'Contact',    path: '/contact',    exact: false },
];

// Navbar only — Services & Industries removed
export const NAVBAR_ROUTES = [
  { label: 'Home',    path: '/',        exact: true  },
  { label: 'Jobs',    path: '/jobs',    exact: false },
  { label: 'Careers', path: '/careers', exact: false },
  { label: 'About',   path: '/about',   exact: false },
  { label: 'Contact', path: '/contact', exact: false },
];

export const FOOTER_ROUTES = {
  company: [
    { label: 'About Us',         path: '/about'       },
    { label: 'Careers & Hiring', path: '/careers'     },
    { label: 'Knowledge Hub',    path: '/blog'        },
    { label: 'Contact Us',       path: '/contact'     },
    { label: 'Admin Access',     path: '/admin/dashboard' },
  ],
  services: [
    { label: 'Recruitment Services', path: '/recruitment-services' },
    { label: 'Staffing Solutions',   path: '/staffing'             },
    { label: 'Manpower Supply',      path: '/manpower'             },
    { label: 'IT Recruitment',       path: '/it-recruitment'       },
    { label: 'HR Consultancy',       path: '/hr-consultancy'       },
    { label: 'Corporate Hiring',     path: '/corporate-hiring'     },
  ],
  industries: [
    { label: 'Information Technology', path: '/it-recruitment'           },
    { label: 'Hospitality & Tourism',  path: '/hospitality-recruitment'  },
    { label: 'Manufacturing & Warehousing', path: '/services/industrial-manpower' },
    { label: 'Logistics & Supply Chain', path: '/services/logistics-warehouse' },
  ],
};
