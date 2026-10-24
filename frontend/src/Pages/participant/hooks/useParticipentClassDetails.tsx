import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClassContext } from "../../Class/Contexts/classContext.js";
import type { ColDef } from "ag-grid-community";
import api from "../../../api/axios.js";
import type { Test } from "../../../Types/test.type.js";

export const  useParticipentClassDetails = (classId: string) => {

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


  return {
    cls,
    activeTab,
    setActiveTab,
    tests,
    columnDefs,
  };
}