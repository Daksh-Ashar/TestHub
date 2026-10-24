import { memo, useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import type { Test } from "../../Types/test.type";
import type { ColDef } from "ag-grid-community";

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

        cellRenderer: (params: any) => {
          return params.data.isPublished ? (
            <span>Published</span>
          ) : (
            <button
              className="btn"
              onClick={() =>
                navigate(
                  `/creator/tests/${params.data._id}/edit`
                )
              }
            >
              Edit
            </button>
          );
        },
      },
    ],
    [navigate]
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