
import { useParticipantClasses } from "./hooks/useParticipentClasses";



const ParticipantClasses = () => {
  const { classes, classCode, setClassCode, loading, joining, showJoinForm, setShowJoinForm, handleJoin, navigate } = useParticipantClasses();

  return (
    <div className="font-[Arial,sans-serif]">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">My Classes</h2>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-md bg-gradient-to-r from-[#073A7C] via-[#1767AD] to-[#255B8E] text-xl text-white shadow-md transition hover:-translate-y-px hover:shadow-lg"
          onClick={() => setShowJoinForm(true)}
          title="Join a new class"
          aria-label="Join a new class"
        >
          +
        </button>
      </div>

      {loading ? (
        <p>Loading classes...</p>
      ) : classes.length === 0 && !showJoinForm ? (
        <p>You haven&apos;t joined any classes yet.</p>
      ) : showJoinForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <section className="w-full max-w-[350px] rounded-md bg-white p-5 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">Join a Class</h3>

            <form onSubmit={handleJoin} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter Class Code"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                required
                className="w-full border-b border-gray-400 px-2 py-2 outline-none focus:border-blue-600"
              />
              <div className="mt-1 flex justify-end gap-2.5">
                <button
                  type="button"
                  className="rounded border border-blue-900 bg-white px-4 py-2 font-medium text-blue-900 hover:bg-blue-50"
                  onClick={() => setShowJoinForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-gradient-to-r from-[#073A7C] via-[#1767AD] to-[#255B8E] px-4 py-2 font-medium text-white shadow-md transition hover:-translate-y-px hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={joining}
                >
                  {joining ? "Joining..." : "Join"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : (
        <div className="mb-10 flex flex-wrap gap-5">
          {classes.map((cls) => (
            <div
              key={cls._id}
              className="flex w-full flex-col items-stretch justify-between gap-3 rounded-md bg-white p-4 shadow-md sm:w-[260px]"
            >
              <h3 className="mb-2 text-lg font-semibold">{cls.name}</h3>
              <p className="mb-2 text-sm text-[#255b8e]">
                {cls.description}
              </p>

              <button
                className="relative overflow-hidden rounded bg-gradient-to-r from-[#073A7C] via-[#1767AD] to-[#255B8E] px-4 py-2 font-medium text-white shadow-md transition hover:-translate-y-px hover:shadow-lg"
                onClick={() => navigate(`/participant/classes/${cls._id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticipantClasses;