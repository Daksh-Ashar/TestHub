import { useContext, useEffect, useState, useMemo } from "react";
import type { ColDef } from "ag-grid-community";
import "../styles/participantClasses.css"
import {
  ClassContext,
  type Participant,
} from "../Pages/Class/Contexts/classContext";

import DataGrid from "./DataGrid";
import "../styles/ParticipentTable.css"

export default function ParticipantsTable({
  classId,
}: {
  classId?: string;
}) {
  const { fetchParticipants } = useContext(ClassContext)!;

  const [participants, setParticipants] = useState<Participant[]>(
    []
  );

  useEffect(() => {
    if (classId) {
      const records = fetchParticipants(classId);

      if (records instanceof Promise) {
        records.then((data: Participant[]) =>
          setParticipants(data)
        );
      } else {
        setParticipants([]);
      }
    }
  }, [classId]);

  const columnDefs = useMemo<ColDef<Participant>[]>(
    () => [
      {
        headerName: "Name",
        field: "name",
        flex: 1,
      },

      {
        headerName: "Email",
        field: "email",
        flex: 1,
      },
    ],
    []
  );

  return (
    <div>
      <div className="toolbar">
  <button className="btn btn-square">
    Add Participant
  </button>
</div>

      <DataGrid<Participant>
        rowData={participants}
        columnDefs={columnDefs}
        paginationPageSize={20}
        paginationPageSizeSelector={[20, 40, 60]}
      />
    </div>
  );
}