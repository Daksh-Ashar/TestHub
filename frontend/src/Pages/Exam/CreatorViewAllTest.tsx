import { memo, useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import type { Test } from "../../Types/test.type";
import type { ColDef, ICellRendererParams } from "ag-grid-community";

import DataGrid from "../../Components/DataGrid";
import { useNavigate } from "react-router-dom";

const CreatorViewAllTest = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await api.get<Test[]>("/tests/testList");
        setTests(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTests();
  }, []);

  const columnDefs = useMemo<ColDef<Test>[]>(
    () => [
      {
        headerName: "Test Name",
        field: "title",
        flex: 1,
      },

      {
        headerName: "Action",
        sortable: false,
        filter: false,
        width: 200,
        pinned: "right",

        cellRenderer: (params: ICellRendererParams<Test>) => {
          const test = params.data;
          if (!test) return null;

          return test.isPublished ? (
            <span>Published</span>
          ) : (
            <button
              className="rounded bg-gradient-to-r from-[#073A7C] via-[#1767AD] to-[#255B8E] px-4 py-2 font-medium text-white shadow-md transition hover:-translate-y-px hover:shadow-lg"
              onClick={() => navigate(`/creator/tests/${test._id}/edit`)}
            >
              Edit
            </button>
          );
        },
      },
    ],
    [navigate],
  );

  return (
    <div>
      <h2>Creator View All Tests</h2>

      <DataGrid<Test>
        rowData={tests}
        columnDefs={columnDefs}
        paginationPageSize={20}
        paginationPageSizeSelector={[20, 40, 60]}
      />
    </div>
  );
};

export default memo(CreatorViewAllTest);
