import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../Styles/authStyle.css";

const Auth = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={tabStyle}>
          <button
            onClick={() => setActiveTab("login")}
            style={activeTab === "login" ? activeBtn : btn}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("register")}
            style={activeTab === "register" ? activeBtn : btn}
          >
            Register
          </button>
        </div>

        {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

/* ---------------- LOGIN FORM ---------------- */

const LoginForm = () => {
  const auth = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await auth?.login(email, password);

      if (user?.role?.toLowerCase() === "creator") {
        navigate("/creator");
      } else if (user?.role?.toLowerCase() === "participant") {
        navigate("/participant");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        style={input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        style={input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" style={primaryBtn} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

/* ---------------- REGISTER FORM ---------------- */

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"creator" | "participant">("participant");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await auth?.register(name, email, password, role);
      if (user?.role?.toLowerCase() === "creator") {
        navigate("/creator");
      } else if (user?.role?.toLowerCase() === "participant") {
        navigate("/participant");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="Name"
        style={input}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        style={input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        style={input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="role-container">
        <label className="role-label">Register As</label>

        <div className="role-options">
          <label className="radio-option">
            <input
              type="radio"
              name="role"
              value="creator"
              checked={role === "creator"}
              onChange={(e) =>
                setRole(e.target.value as "creator" | "participant")
              }
            />
            Creator
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="role"
              value="participant"
              checked={role === "participant"}
              onChange={(e) =>
                setRole(e.target.value as "creator" | "participant")
              }
            />
            Participant
          </label>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" style={primaryBtn} disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

/* ---------------- STYLES ---------------- */

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "#F3F4F6",
};

const cardStyle = {
  background: "white",
  padding: "2rem",
  borderRadius: "12px",
  width: "350px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
};

const tabStyle = {
  display: "flex",
  marginBottom: "1rem",
};

const btn = {
  flex: 1,
  padding: "10px",
  border: "none",
  cursor: "pointer",
  background: "#e5e7eb",
};

const activeBtn = {
  ...btn,
  background: "#1D4ED8",
  color: "white",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
};

const primaryBtn = {
  width: "100%",
  padding: "10px",
  background: "#1D4ED8",
  color: "white",
  border: "none",
  cursor: "pointer",
};

export default Auth;
