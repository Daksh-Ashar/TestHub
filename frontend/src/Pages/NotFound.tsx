import { Link } from "react-router-dom";

const NotFound = () => {
  const isLoggedIn = false; // later connect with auth context

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>404 - Page Not Found</h2>
      <Link to={isLoggedIn ? "/" : "/auth"}>
        Go to {isLoggedIn ? "Home" : "Login"}
      </Link>
    </div>
  );
};

export default NotFound;