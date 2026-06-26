import { Link } from "react-router-dom";
import logoImg from "@/assets/image/logo.png"; // Aapki PNG file ka path

const Logo = ({ variant = "dark" }) => {
  const isLight = variant === "light";
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 no-underline group"
      aria-label="Stryper Solution - Home"
    >
      {/* circular logo */}
      <img
        src={logoImg}
        alt="Stryper Solution Logo"
        className="h-10 w-10 rounded-full object-cover border border-white/10 shrink-0"
      />
      <span className={`font-display font-bold text-base tracking-tight transition-colors ${
        isLight 
          ? "text-neutral-800 group-hover:text-purple-600" 
          : "text-white group-hover:text-purple-400"
      }`}>
        stryper solution
      </span>
    </Link>
  );
};

export default Logo;
