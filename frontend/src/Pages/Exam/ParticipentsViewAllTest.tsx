import { memo, useEffect, useState } from "react";
import api from "../../api/axios";

import type { Test } from "../../Types/test.type";

import type { ColDef } from "ag-grid-community";

import DataGrid from "../../Components/DataGrid";
import "../../styles/ParticipentViewAllTest.css";

const ParticipentViewAllTest = () => {
  const [tests, setTests] = useState<Test[]>([]);

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
      cellRenderer: (params: any) => {
        return params.value ? (
          <button className="startTestBtnCls">Start Test</button>
        ) : (
          "Not Published"
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