import { createContext, useContext } from "react";

export interface Class {
  _id: string;
  name: string;
  description?: string;
  joinCode: string;
  createdAt: string;
}

export interface Participant {
  id: number;
  name: string;
  email: string;
}

export interface ClassContextType {
  classes: Class[];
  loading: boolean;
  fetchClasses: () => Promise<void>;
  fetchParticipants: (classId: string) => Promise<Participant[]>;
  createClass: (name: string, description: string) => Promise<void>;
}

export const ClassContext = createContext<ClassContextType | null>(null);

export const useClassContext = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error("useClassContext must be used within ClassProvider");
  }
  return context;
};
