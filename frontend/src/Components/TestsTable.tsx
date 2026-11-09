import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import type { ColDef } from "ag-grid-community";

import api from "../api/axios";
import type { Test } from "../Types/test.type";

import DataGrid from "../Components/DataGrid";

export default function TestsTable() {
  const [tests, setTests] = useState<Test[]>([]);
  const { classId } = useParams();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await api.get(`/tests/${classId}`);
        setTests(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTests();
  }, [classId]);

  const handlePublish = async (testId: string) => {
    try {
      await api.patch(`/tests/${testId}/publish`);
      setTests((prev) =>
        prev.map((t) =>
          t._id === testId
            ? { ...t, isPublished: true }
            : t
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const columnDefs = useMemo<ColDef<Test>[]>(
    () => [
      {
        headerName: "Test Name",
        field: "title",
        flex: 1,
      },

     

      {
        headerName: "Actions",
        sortable: false,
        filter: false,
        width: 260,
        pinned: "right",

        cellRenderer: (params: any) => {
          const test: Test = params.data;

          return (
            <div className="flex gap-2">
              <button className="inline-flex h-7 items-center justify-center rounded-md bg-brand-600 px-2 text-[11px] leading-none text-white hover:bg-brand-700">
                Edit
              </button>

              {!test.isPublished && (
                <button
                  className="inline-flex h-7 items-center justify-center rounded-md bg-brand-600 px-2 text-[11px] leading-none text-white hover:bg-brand-700"
                  onClick={() =>
                    handlePublish(test._id)
                  }
                >
                  Publish
                </button>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-2.5 flex h-11 items-center">
        <Link
          className="inline-flex h-7 items-center justify-center rounded-md bg-brand-600 px-2 text-[11px] leading-none text-white hover:bg-brand-700"
          to={`/creator/classes/${classId}/tests/create`}
        >
          Create Test
        </Link>
      </div>

      {/* Grid */}
      <DataGrid<Test>
        rowData={tests}
        columnDefs={columnDefs}
        paginationPageSize={20}
        paginationPageSizeSelector={[20, 40, 60]}
      />
    </div>
  );
}