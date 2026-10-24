import {
  createContext,
  useState,
  useContext,
  type ReactNode,
} from "react";
import api from "../../../api/axios";

export interface Class {
  _id: string;
  name: string;
  description?: string;
  joinCode: string;
  createdAt: string;
}

export  interface Participant {
  id: number;
  name: string;
  email: string;
}

interface ClassContextType {
  classes: Class[];
  loading: boolean;
  fetchClasses: () => Promise<void>;
  fetchParticipants: (classId: string) => Promise<Participant[]>;
  createClass: (name: string, description: string) => Promise<void>;
}

interface ClassProviderProps {
  children: ReactNode;
}


export const ClassContext = createContext<ClassContextType | null>(null);

export const ClassProvider = ({ children }: ClassProviderProps) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await api.get<Class[]>("/classes/my");
      setClasses(res.data);
    } catch (err) {
      console.error("Fetch classes failed", err);
    } finally {
      setLoading(false);
    }
  };

  const createClass = async (name: string, description: string) => {
    try {
      setLoading(true);
      await api.post("/classes", { name, description });

      // refresh list
      await fetchClasses();
    } catch (err) {
      console.error("Create class failed", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants: (classId: string) => Promise<Participant[]> = async (classId: string) => {
    try {
      setLoading(true);
      const res = await api.get<Participant[]>(`/classes/${classId}/participants`);
      return res.data;
    } catch (err) {
      console.error("Fetch participants failed", err);
      return [];
    }
    finally {
      setLoading(false);
    }
  };


  const value: ClassContextType = {
  classes,
  loading,
  fetchClasses,
  createClass,
  fetchParticipants
};

  return (
    <ClassContext.Provider value={value} >
      {children}
    </ClassContext.Provider>
  );
};

export const useClassContext = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error("useClassContext must be used within ClassProvider");
  }
  return context;
};