import { useContext, useEffect } from "react";
import { ClassContext } from "../Pages/Class/Contexts/classContext";

export default function ClassInfo({classId}: {classId?: string}) {
  const {classes, fetchClasses} = useContext(ClassContext)!;
  const cls = classes.find((c) => c._id === classId);

  useEffect(() => {
    // In case user directly lands on details page, we need to fetch classes to get the details
    if (!cls) {
      fetchClasses();
    }
  }, [classId]);

  return(
    <div className="space-y-2 p-4 font-mono text-[1.2rem]">

      <p><strong>Class Name:</strong> {cls?.name ? cls.name : "No name available"}</p>
      <p><strong>Description:</strong> {cls?.description ? cls.description : "No description available"}</p>
      <p><strong>Join code:</strong> {cls?.joinCode ? cls.joinCode : "No join code available"}</p>
      <p><strong>Created:</strong> {cls?.createdAt ? new Date(cls.createdAt).toLocaleDateString() : "Unknown"}</p>

    </div>
  )

}