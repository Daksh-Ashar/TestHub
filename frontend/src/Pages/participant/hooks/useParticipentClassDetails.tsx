import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClassContext } from "../../Class/Contexts/classContext.js";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import api from "../../../api/axios.js";
import type { Test } from "../../../Types/test.type.js";

export const useParticipentClassDetails = (classIdParam?: string) => {
  const { classId: routeClassId } = useParams<{ classId: string }>();
  const classId = classIdParam ?? routeClassId;
  const [activeTab, setActiveTab] = useState<"details" | "tests">("details");

  const [tests, setTests] = useState<Test[]>([]);

  const navigate = useNavigate();

  const { classes, fetchClasses } = useContext(ClassContext)!;

  useEffect(() => {
    if (classId) {
      fetchClasses();
    }
  }, [classId, fetchClasses]);

  const cls = classes.find((c) => c._id === classId);

  const fetchTests = useCallback(async () => {
    if (!classId) return;

    try {
      const res = await api.get<Test[]>(`/tests/${classId}`);
      const published = res.data.filter((test) => test.isPublished);
      setTests(published);
    } catch (err) {
      console.error(err);
    }
  }, [classId]);

  const onTestTabClick = useCallback(() => {
    setActiveTab("tests");
    void fetchTests();
  }, [fetchTests]);

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

        valueFormatter: (params) => `${params.value} mins`,
      },

      {
        headerName: "Action",
        field: "action",

        sortable: false,
        filter: false,

        width: 180,
        pinned: "right",

        cellRenderer: (params: ICellRendererParams<Test>) => {
          const test = params.data;
          if (!test) return null;

          return (
            <button
              className="actionButtonCls"
              onClick={() => {
                navigate(
                  `/participant/classes/${classId}/tests/${test._id}/instructions`,
                );
              }}
            >
              Start Test
            </button>
          );
        },
      },
    ],
    [navigate, classId],
  );

  return {
    cls,
    activeTab,
    setActiveTab,
    onTestTabClick,
    tests,
    columnDefs,
  };
};
