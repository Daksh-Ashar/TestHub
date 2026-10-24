import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth || !auth.user) return null;

  const role = auth.user.role;

  const handleLogout = async () => {
    await auth.logout();
    navigate("/auth");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">Test Platform</div>

      <nav className="sidebar-menu">
        <NavLink to={`/${role}`} end>
          Dashboard
        </NavLink>

        <NavLink to={`/${role}/classes`}>
          My Classes
        </NavLink>

        <NavLink to={`/${role}/tests`}>
          Tests
        </NavLink>

        {role === "participant" && (
          <NavLink to={`/${role}/results`}>
            Results
          </NavLink>
        )}
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;