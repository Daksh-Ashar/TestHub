import { createContext } from "react";
import type { User } from "../Types/auth.type";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: "creator" | "participant",
  ) => Promise<User>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
