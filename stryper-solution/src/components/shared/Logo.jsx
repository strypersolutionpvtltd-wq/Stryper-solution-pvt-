import { Link } from "react-router-dom";
import logoImg from "@/assets/image/logo.png"; // Aapki PNG file ka path

const Logo = ({ variant = "dark" }) => {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 no-underline group"
      aria-label="Stryper Solution - Home"
    >
      {/* Aapka Naya Logo PNG */}
      <img
        src={logoImg}
        alt="Stryper Solution Logo"
        className="h-10 w-auto object-contain"
      />
    </Link>
  );
};

export default Logo;
