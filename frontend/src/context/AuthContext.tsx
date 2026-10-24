import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import api from "../api/axios";
import { type User } from "../Types/auth.type";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: "creator" | "participant"
  ) => Promise<User>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check auth on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me"); 
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const register = async (
  name: string,
  email: string,
  password: string,
  role: "creator" | "participant"
): Promise<User> => {
  const res = await api.post("/auth/register", {
    name,
    email,
    password,
    role,
  });

  setUser(res.data.user);
  return res.data.user;
};

 const login = async (email: string, password: string) : Promise<User> => {
  const res = await api.post("/auth/login", { email, password });
  setUser(res.data.user);
  return res.data.user; 
};

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};