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
    <aside className="flex w-20 shrink-0 flex-col bg-slate-800 p-2 text-white sm:w-64 sm:p-4">
      <div className="mb-8 px-2 text-center text-lg font-bold tracking-tight sm:text-left">
        <span className="hidden sm:inline">Test Platform</span>
        <span className="sm:hidden">TP</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        <NavLink
          to={`/${role}/classes`}
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 text-sm transition-colors ${
              isActive
                ? "bg-slate-700 font-semibold text-white"
                : "text-slate-300 hover:bg-slate-700/70 hover:text-white"
            }`
          }
        >
          <span className="hidden sm:inline">My Classes</span>
          <span className="sm:hidden">Classes</span>
        </NavLink>

        <NavLink
          to={`/${role}/tests`}
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 text-sm transition-colors ${
              isActive
                ? "bg-slate-700 font-semibold text-white"
                : "text-slate-300 hover:bg-slate-700/70 hover:text-white"
            }`
          }
        >
          <span className="hidden sm:inline">Tests</span>
          <span className="sm:hidden">Tests</span>
        </NavLink>

        {role === "participant" && (
          <NavLink
            to={`/${role}/results`}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-slate-700 font-semibold text-white"
                  : "text-slate-300 hover:bg-slate-700/70 hover:text-white"
              }`
            }
          >
            <span className="hidden sm:inline">Results</span>
            <span className="sm:hidden">Results</span>
          </NavLink>
        )}
      </nav>

      <button
        className="mt-6 rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
        onClick={handleLogout}
      >
        <span className="hidden sm:inline">Logout</span>
        <span className="sm:hidden">Exit</span>
      </button>
    </aside>
  );
};

export default Sidebar;