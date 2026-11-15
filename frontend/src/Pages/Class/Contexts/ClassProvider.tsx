import { useCallback, useMemo, useState, type ReactNode } from "react";
import api from "../../../api/axios";
import {
  ClassContext,
  type Class,
  type ClassContextType,
  type Participant,
} from "./classContext";

export const ClassProvider = ({ children }: { children: ReactNode }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<Class[]>("/classes/my");
      setClasses(res.data);
    } catch (err) {
      console.error("Fetch classes failed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createClass = useCallback(
    async (name: string, description: string) => {
      try {
        setLoading(true);
        await api.post("/classes", { name, description });
        await fetchClasses();
      } catch (err) {
        console.error("Create class failed", err);
      } finally {
        setLoading(false);
      }
    },
    [fetchClasses],
  );

  const fetchParticipants = useCallback(
    async (classId: string): Promise<Participant[]> => {
      try {
        setLoading(true);
        const res = await api.get<Participant[]>(
          `/classes/${classId}/participants`,
        );
        return res.data;
      } catch (err) {
        console.error("Fetch participants failed", err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const value = useMemo<ClassContextType>(
    () => ({
      classes,
      loading,
      fetchClasses,
      createClass,
      fetchParticipants,
    }),
    [classes, loading, fetchClasses, createClass, fetchParticipants],
  );

  return (
    <ClassContext.Provider value={value}>{children}</ClassContext.Provider>
  );
};
