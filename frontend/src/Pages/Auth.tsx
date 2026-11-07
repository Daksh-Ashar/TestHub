import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../Styles/authStyle.css";

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return fallback;
};

const Auth = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex overflow-hidden rounded-lg bg-slate-100">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 px-3 py-2 text-sm font-semibold transition-colors ${
              activeTab === "login"
                ? "bg-brand-700 text-white"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 px-3 py-2 text-sm font-semibold transition-colors ${
              activeTab === "register"
                ? "bg-brand-700 text-white"
                : "text-slate-600 hover:bg-slate-200"
            }`}
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
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-3">
      <input
        type="email"
        placeholder="Email"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        className="w-full rounded-lg bg-brand-700 px-3 py-2 font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading}
      >
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
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-3">
      <input
        type="text"
        placeholder="Name"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
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

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        className="w-full rounded-lg bg-brand-700 px-3 py-2 font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default Auth;
