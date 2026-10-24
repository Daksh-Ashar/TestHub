import { memo, useEffect, useState, useMemo } from "react";
import type { ColDef } from "ag-grid-community";

import type { OverallTests } from "../../Types/test.type";
import api from "../../api/axios.js";

import DataGrid from "../../Components/DataGrid";

const ParticipentsResults = () => {
  const [tests, setTests] = useState<OverallTests[]>([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await api.get<OverallTests[]>("/results/me");
        setTests(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTests();
  }, []);

  const columnDefs = useMemo<ColDef<OverallTests>[]>(
    () => [
      {
        headerName: "Test Name",
        field: "testId.title",
        flex: 1,
        sortable: true,
        filter: true,
      },

      {
        headerName: "Score",
        field: "score",
        width: 150,
        sortable: true,
        filter: true,
      },
    ],
    []
  );

  return (
    <div>
      <h2>Participant Results</h2>

      <DataGrid<OverallTests>
        rowData={tests}
        columnDefs={columnDefs}
        paginationPageSize={20}
        paginationPageSizeSelector={[20, 40, 60]}
      />
    </div>
  );
};

export default memo(ParticipentsResults);