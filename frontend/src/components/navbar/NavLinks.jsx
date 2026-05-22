import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NAVBAR_ROUTES } from '@/routes/routeConfig';

/**
 * Desktop nav links — always dark text on white navbar.
 * Active link gets gold underline matching the logo accent.
 */
const NavLinks = () => (
  <>
    {NAVBAR_ROUTES.map(({ label, path }) => (
      <NavLink
        key={path}
        to={path}
        end={path === '/'}
        className="group relative"
      >
        {({ isActive }) => (
          <span
            className={[
              'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg',
              'transition-colors duration-200 select-none',
              isActive
                ? 'text-brand-gold-400 font-semibold hover : text-white-70'
                : 'text-brand-gold-400/80  hover:text-white-70',
            
            ].join(' ')}
          >
            {label}

            {/* Gold underline for active link — matches logo */}
            <span
              className={[
                'absolute bottom-0.5 left-3 right-3 h-[2.5px] rounded-full',
                'bg-brand-gold-400 transition-transform duration-250 origin-left',
                isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
              ].join(' ')}
              aria-hidden="true"
            />
          </span>
        )}
      </NavLink>
    ))}
  </>
);

export default NavLinks;
