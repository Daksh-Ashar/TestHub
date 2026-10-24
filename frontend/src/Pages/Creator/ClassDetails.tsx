import { useContext, useState } from "react";
import ClassInfo from "../../Components/ClassInfo";
import ParticipantsTable from "../../Components/ParticipantsTable";
import TestsTable from "../../Components/TestsTable";
import "../../styles/classDetails.css";
import { useParams } from "react-router-dom";
import { ClassContext } from "../Class/Contexts/classContext";

const ClassDetails = () => {

  const [activeTab, setActiveTab] = useState("details");
  const {classId} = useParams();
  const {classes} = useContext(ClassContext)!;
  const cls = classes.find(c => c._id === classId);
  if (!cls) {
    return <div>Class not found</div>;
  }

  return (
    <div className="class-page">

      <h1 className="class-title">{cls.name}</h1>

      {/* Tabs */}
      <div className="tabs">

        <button
          className={activeTab === "details" ? "tab active" : "tab"}
          onClick={() => setActiveTab("details")}
        >
          Class Detail
        </button>

        <button
          className={activeTab === "participants" ? "tab active" : "tab"}
          onClick={() => setActiveTab("participants")}
        >
          Participants
        </button>

        <button
          className={activeTab === "tests" ? "tab active" : "tab"}
          onClick={() => setActiveTab("tests")}
        >
          Tests
        </button>

      </div>

      {/* Tab Content */}

      <div className="tab-content">

        {activeTab === "details" && <ClassInfo classId={classId} />}
        {activeTab === "participants" && <ParticipantsTable classId={classId}/>}
        {activeTab === "tests" && <TestsTable />}

      </div>

    </div>
  );
}

export default ClassDetails;