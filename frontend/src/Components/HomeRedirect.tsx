import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function HomeRedirect() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) return;

    const { user, loading } = auth;

    if (loading) return;

    if (!user) {
      navigate("/auth");
    } else if (user.role === "creator") {
      navigate("/creator/classes");
    } else if (user.role === "participant") {
      navigate("/participant/classes");
    }
  }, [auth, navigate]);

  return <div>Loading...</div>;
}