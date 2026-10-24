
import "../../styles/participantClasses.css";
import { useParticipantClasses } from "./hooks/useParticipentClasses";



const ParticipantClasses = () => {
  const { classes, classCode, setClassCode, loading, joining, showJoinForm, setShowJoinForm, handleJoin, navigate } = useParticipantClasses();

  return (
    <>
        
      <div className="participant-classes-page">
      
      <div className="header">
            <h2>My Classes</h2>
        <button
            type="submit"
            className="btn JoinClassButton"
            onClick={()=>{
              setShowJoinForm(true)
            }}
            title="Join a new class"
          >
            {"+"}
          </button>
      </div>
        

      {loading ? (
        <p>Loading classes...</p>
      ) : classes.length === 0 && !showJoinForm? (
        <p>You haven't joined any classes yet.</p>
      ) : showJoinForm ? (<div className="join-class-section">
        <h3>Join a Class</h3>

        <form
          onSubmit={handleJoin}
          className="join-class-form"
        >
          <input
            type="text"
            placeholder="Enter Class Code"
            value={classCode}
            onChange={(e) =>
              setClassCode(e.target.value)
            }
            required={true}
          />
          <div className="ActionBtns">
            <button
            className="btn cancel-btn"
            onClick={() => setShowJoinForm(false)}
          >
            {"Cancel"}
          </button>
            <button
            type="submit"
            className={`btn`}
            disabled={joining}
          >
            {joining ? "Joining..." : "Join"}
          </button>
          </div>

        </form>
      </div>) : (
        <div className="class-list">
          {classes.map((cls) => (
            <div key={cls._id} className="class-card">
              <h3>{cls.name}</h3>
              <p>{cls.description}</p>

            
              <button
                className="btn"
                onClick={() =>
                  navigate(
                    `/participant/classes/${cls._id}`
                  )
                }
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
    </>
    
  );
};

export default ParticipantClasses;