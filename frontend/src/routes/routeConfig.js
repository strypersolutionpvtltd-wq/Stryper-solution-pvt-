/**
 * Route configuration map.
 * Used by Navbar, Footer, and sitemap generation.
 */
export const NAV_ROUTES = [
  { label: 'Home',       path: '/',           exact: true  },
  { label: 'About',      path: '/about',      exact: false },
  { label: 'Services',   path: '/services',   exact: false },
  { label: 'Industries', path: '/industries', exact: false },
  { label: 'Careers',    path: '/careers',    exact: false },
  { label: 'Contact',    path: '/contact',    exact: false },
];

// Navbar only — Services & Industries removed
export const NAVBAR_ROUTES = [
  { label: 'Home',    path: '/',        exact: true  },
  { label: 'About',   path: '/about',   exact: false },
  { label: 'Jobs',    path: '/jobs',    exact: false },
  { label: 'Careers', path: '/careers', exact: false },
  { label: 'Contact', path: '/contact', exact: false },
];

export const FOOTER_ROUTES = {
  company: [
    { label: 'About Us',    path: '/about'      },
    { label: 'Our Team',    path: '/about#team'  },
    { label: 'Careers',     path: '/careers'     },
    { label: 'Contact',     path: '/contact'     },
  ],
  services: [
    { label: 'Permanent Staffing',  path: '/services#permanent'  },
    { label: 'Contract Staffing',   path: '/services#contract'   },
    { label: 'Executive Search',    path: '/services#executive'  },
    { label: 'HR Consulting',       path: '/services#consulting' },
  ],
  industries: [
    { label: 'Information Technology', path: '/industries#it'         },
    { label: 'Banking & Finance',      path: '/industries#finance'    },
    { label: 'Healthcare',             path: '/industries#healthcare' },
    { label: 'Manufacturing',          path: '/industries#manufacturing' },
  ],
};
