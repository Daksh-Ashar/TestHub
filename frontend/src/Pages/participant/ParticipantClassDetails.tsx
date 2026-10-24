import {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
  memo
} from "react";

import { useParams, useNavigate } from "react-router-dom";

import api from "../../api/axios.js";

import type { Test } from "../../Types/test.type.js";

import type { ColDef } from "ag-grid-community";

import ClassInfo from "../../Components/ClassInfo.js";

import DataGrid from "../../Components/DataGrid.js";

import "../../styles/classDetails.css";

import { ClassContext } from "../Class/Contexts/classContext.js";

 const ParticipantClassDetails = () => {
  const { classId } = useParams<{ classId: string }>();

  const [activeTab, setActiveTab] = useState<"details" | "tests">("details");

  const [tests, setTests] = useState<Test[]>([]);

  const navigate = useNavigate();

  const { classes, fetchClasses } = useContext(ClassContext)!;

  useEffect(() => {
    if (classId) {
      fetchClasses();
    }
  }, [classId]);

  const cls = classes.find((c) => c._id === classId);

  const onTestTabClick = useCallback(() => {
    setActiveTab("tests");

    const fetchTests = async () => {
      try {
        const res = await api.get<Test[]>(`/tests/${classId}`);

        const published = res.data.filter(
          (t) => t.isPublished === true
        );

        setTests(published);
      } catch (err) {
        console.error(err);
      }
    };

    if (classId) fetchTests();
  }, [classId]);

  useEffect(() => {
    if (activeTab === "tests") {
      onTestTabClick();
    }
  }, [activeTab, onTestTabClick]);

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "Test Name",
        field: "title",
        flex: 1,
      },

      {
        headerName: "Duration",
        field: "duration",
        width: 150,

        valueFormatter: (params) =>
          `${params.value} mins`,
      },

      {
        headerName: "Action",
        field: "action",

        sortable: false,
        filter: false,

        width: 180,
        pinned: "right",

        cellRenderer: (params: any) => (
          <button
           className="actionButtonCls"
            onClick={() => {
              navigate(
                `/participant/classes/${classId}/tests/${params.data._id}/instructions`
              );
            }}
          >
            Start Test
          </button>
        ),
      },
    ],
    [navigate, classId]
  );

  if (!cls) {
    return <div>Class not found</div>;
  }

  return (
    <div className="class-page">
      <h1 className="class-title">{cls.name}</h1>

      {/* Tabs */}
      <div className="tabs">
        <button
          onClick={() => setActiveTab("details")}
          className={
            activeTab === "details"
              ? "tab active"
              : "tab"
          }
        >
          Class Detail
        </button>

        <button
          onClick={onTestTabClick}
          className={
            activeTab === "tests"
              ? "tab active"
              : "tab"
          }
        >
          Tests
        </button>
      </div>

      {/* Tab Content */}

      <div className="tab-content">
        {activeTab === "details" && (
          <ClassInfo classId={classId} />
        )}

        {activeTab === "tests" && (
          <DataGrid<Test>
            rowData={tests}
            columnDefs={columnDefs}
            paginationPageSize={20}
            paginationPageSizeSelector={[20, 40, 60]}
          />
        )}
      </div>
    </div>
  );
}

export default memo(ParticipantClassDetails);