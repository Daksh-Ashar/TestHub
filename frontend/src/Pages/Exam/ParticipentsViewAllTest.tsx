import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import type { Test } from "../../Types/test.type";

import type { ColDef, ICellRendererParams } from "ag-grid-community";

import DataGrid from "../../Components/DataGrid";
import "../../styles/ParticipentViewAllTest.css";

const ParticipentViewAllTest = () => {
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

  const columnDefs: ColDef[] = [
    {
      headerName: "Test Name",
      field: "title",
      flex: 1,
    },
    {
      headerName: "Duration",
      field: "duration",
      valueFormatter: (params) => `${params.value} mins`,
    },
    {
      headerName: "Action",
      field: "isPublished",
      sortable: false,
    filter: false,
    floatingFilter: false,
      cellRenderer: (params: ICellRendererParams<Test>) => {
        const test = params.data;
        if (!test) return null;
        if (!test.isPublished) return "Not Published";

        if (test.hasSubmitted) {
          return (
            <span className="block w-full text-center font-medium text-green-700">
              Submitted
            </span>
          );
        }

        return (
          <button
            type="button"
            className="startTestBtnCls"
            onClick={() =>
              navigate(
                `/participant/classes/${test.classId}/tests/${test._id}/instructions`,
              )
            }
          >
            Start Test
          </button>
        );
      },
    },
  ];

  return (
    <div>
      <h2>Participant View All Tests</h2>

      <DataGrid<Test>
        rowData={tests}
        columnDefs={columnDefs}
        paginationPageSize={20}
        paginationPageSizeSelector={[20, 40, 60]}
      />
    </div>
  );
};

export default memo(ParticipentViewAllTest);