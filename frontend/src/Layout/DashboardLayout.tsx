import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import "../styles/dashboard.css";


const DashboardLayout = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <Header />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;