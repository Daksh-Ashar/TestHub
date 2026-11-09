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
            className="border-0 bg-transparent font-bold text-blue-800 hover:underline"
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
    return <div className="p-5">Class not found</div>;
  }

  return (
    <div className="p-5 font-[Arial,sans-serif]">
      <h1 className="mb-5 text-2xl">{cls.name}</h1>

      {/* Tabs */}
      <div className="mb-5 flex border-b border-gray-300">
        <button
          onClick={() => setActiveTab("details")}
          className={
            activeTab === "details"
              ? "border-b-[3px] border-blue-600 px-5 py-2.5 text-base font-bold hover:bg-gray-100"
              : "border-b-[3px] border-transparent px-5 py-2.5 text-base hover:bg-gray-100"
          }
        >
          Class Detail
        </button>

        <button
          onClick={onTestTabClick}
          className={
            activeTab === "tests"
              ? "border-b-[3px] border-blue-600 px-5 py-2.5 text-base font-bold hover:bg-gray-100"
              : "border-b-[3px] border-transparent px-5 py-2.5 text-base hover:bg-gray-100"
          }
        >
          Tests
        </button>
      </div>

      {/* Tab Content */}

      <div className="bg-white">
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