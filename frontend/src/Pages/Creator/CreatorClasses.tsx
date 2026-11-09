import { useContext, useEffect, useState } from "react";
import api from "../../api/axios";
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
    <div className="font-[Arial,sans-serif]">
      <h2 className="mb-5 text-2xl font-semibold">My Classes</h2>

      <div className="mb-10 flex flex-wrap gap-5">
        {classes.length === 0 ? (
          <p>No classes created yet.</p>
        ) : (
          classes.map((cls) => (
            <div
              key={cls._id}
              className="flex w-full flex-col items-stretch justify-between gap-3 rounded-md bg-white p-4 shadow-md sm:w-[250px]"
            >
              <h3 className="text-lg font-semibold">{cls.name}</h3>
              <p className="text-sm text-slate-600">{cls.description}</p>

              <Link
                className="inline-flex items-center justify-center rounded bg-gradient-to-r from-[#073A7C] via-[#1767AD] to-[#255B8E] px-4 py-2 text-center font-medium text-white shadow-md transition hover:-translate-y-px hover:shadow-lg"
                to={`/creator/classes/${cls._id}`}
              >
                Open Class
              </Link>
            </div>
          ))
        )}
      </div>

      <div className="w-full max-w-md rounded-md bg-white p-5">
        <h3 className="mb-4 text-lg font-semibold">Create New Class</h3>

        <form className="flex flex-col gap-2.5" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Class Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
            className="w-full rounded border border-gray-300 p-2"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="w-full rounded border border-gray-300 p-2"
          />

          <button
            type="submit"
            className="w-fit cursor-pointer rounded bg-brand-600 px-4 py-2 text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
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