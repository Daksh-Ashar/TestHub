import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/header.css";

const Header = () => {
  const auth = useContext(AuthContext);

  if (!auth || !auth.user) return null;

  return (
    <header className="flex h-16 items-center justify-end border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 font-bold text-white"
        aria-label="User profile"
      >
            {auth?.user?.email?.split("@")[0][0].toUpperCase() || "U"}
      </div>
    </header>
  );
};

export default Header;