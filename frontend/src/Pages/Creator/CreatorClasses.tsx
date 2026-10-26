import { useContext, useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/creatorClasses.css";
import { Link } from "react-router-dom";
import { ClassContext } from "../Class/Contexts/classContext";

const CreatorClasses = () => {
  const { classes, fetchClasses } = useContext(ClassContext)!;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/classes", {
        name,
        description,
      });

      setName("");
      setDescription("");
      await fetchClasses();
    } catch (err) {
      console.error("Create class failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="classes-page">
      <h2>My Classes</h2>

      <div className="class-list">
        {classes.length === 0 ? (
          <p>No classes created yet.</p>
        ) : (
          classes.map((cls) => (
            <div key={cls._id} className="class-card">
              <h3>{cls.name}</h3>
              <p>{cls.description}</p>

              <Link
                className="btn btn-link"
                to={`/creator/classes/${cls._id}`}
              >
                Open Class
              </Link>
            </div>
          ))
        )}
      </div>

      <div className="create-class-form">
        <h3>Create New Class</h3>

        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Class Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <button
            type="submit"
            className="btn"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Class"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatorClasses;