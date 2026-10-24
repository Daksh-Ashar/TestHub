import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";



interface Class {
  _id: string;
  name: string;
  description?: string;
  joinCode: string;
}

export const useParticipantClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/classes/my");
      setClasses(res.data);
    } catch (err) {
      console.error("Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!classCode.trim()) return;

    try {
      setJoining(true);

      await api.post("/classes/join", {
        joinCode: classCode.trim(),
      });

      setClassCode("");
      await fetchClasses();
    } catch (err) {
      console.error("Failed to join class");
    } finally {
      setJoining(false);
    }
  };

return {
    classes,
    classCode,
    setClassCode,
    loading,
    joining,
    showJoinForm,
    setShowJoinForm,
    handleJoin,
    navigate
}

}