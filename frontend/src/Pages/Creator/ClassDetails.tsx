import { useContext, useState } from "react";
import ClassInfo from "../../Components/ClassInfo";
import ParticipantsTable from "../../Components/ParticipantsTable";
import TestsTable from "../../Components/TestsTable";
import { useParams } from "react-router-dom";
import { ClassContext } from "../Class/Contexts/classContext";

const ClassDetails = () => {

  const [activeTab, setActiveTab] = useState("details");
  const {classId} = useParams();
  const {classes} = useContext(ClassContext)!;
  const cls = classes.find(c => c._id === classId);
  if (!cls) {
    return <div className="p-5">Class not found</div>;
  }

  return (
    <div className="p-5 font-[Arial,sans-serif]">

      <h1 className="mb-5 text-2xl">{cls.name}</h1>

      {/* Tabs */}
      <div className="mb-5 flex border-b border-gray-300">

        <button
          className={`border-b-[3px] px-5 py-2.5 text-base hover:bg-gray-100 ${
            activeTab === "details"
              ? "border-blue-600 font-bold"
              : "border-transparent"
          }`}
          onClick={() => setActiveTab("details")}
        >
          Class Detail
        </button>

        <button
          className={`border-b-[3px] px-5 py-2.5 text-base hover:bg-gray-100 ${
            activeTab === "participants"
              ? "border-blue-600 font-bold"
              : "border-transparent"
          }`}
          onClick={() => setActiveTab("participants")}
        >
          Participants
        </button>

        <button
          className={`border-b-[3px] px-5 py-2.5 text-base hover:bg-gray-100 ${
            activeTab === "tests"
              ? "border-blue-600 font-bold"
              : "border-transparent"
          }`}
          onClick={() => setActiveTab("tests")}
        >
          Tests
        </button>

      </div>

      {/* Tab Content */}

      <div className="bg-white">

        {activeTab === "details" && <ClassInfo classId={classId} />}
        {activeTab === "participants" && <ParticipantsTable classId={classId}/>}
        {activeTab === "tests" && <TestsTable />}

      </div>

    </div>
  );
}

export default ClassDetails;