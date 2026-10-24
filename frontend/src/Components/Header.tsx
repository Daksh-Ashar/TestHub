import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/header.css";

const Header = () => {
  const auth = useContext(AuthContext);

  if (!auth || !auth.user) return null;

  return (
    <div className="header">
      <div className="profileCircle">
            {auth?.user?.email?.split("@")[0][0].toUpperCase() || "U"}
      </div>
    </div>
  );
};

export default Header;