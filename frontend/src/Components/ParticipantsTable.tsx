import { useContext, useEffect, useState, useMemo } from "react";
import type { ColDef } from "ag-grid-community";
import {
  ClassContext,
  type Participant,
} from "../Pages/Class/Contexts/classContext";
import DataGrid from "./DataGrid";

export default function ParticipantsTable({ classId }: { classId?: string }) {
  const { fetchParticipants } = useContext(ClassContext)!;

  const [participantData, setParticipantData] = useState<{
    classId: string;
    participants: Participant[];
  } | null>(null);

  useEffect(() => {
    if (!classId) return;

    let cancelled = false;
    void fetchParticipants(classId).then((data) => {
      if (!cancelled) {
        setParticipantData({ classId, participants: data });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [classId, fetchParticipants]);

  const participants =
    participantData && participantData.classId === classId
      ? participantData.participants
      : [];

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
    [],
  );

  return (
    <div>
      <div className="mb-2.5 flex h-11 items-center">
        <button className="h-11 rounded-md bg-brand-600 px-3 text-sm font-medium text-white hover:bg-brand-700">
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
