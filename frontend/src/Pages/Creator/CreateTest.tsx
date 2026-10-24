import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function CreateTest() {
  const { classId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      classId,
      duration: Number(duration)
    };

    try {
    
    const res = await api.post("/tests", { ...payload });

    const data = await res.data;

    // assuming API returns created test with _id
    const testId = data._id;

    // redirect to add questions page
    navigate(`/creator/classes/${classId}/tests/${testId}/questions`);

  } catch (err) {
    console.error("Create test failed", err);
  }

  };

  return (
    <div>
      <h2>Create Test</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label>Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          <label>Duration (minutes)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <button type="submit">Create Test</button>
      </form>
    </div>
  );
}