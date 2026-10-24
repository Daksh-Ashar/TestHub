import { AgGridReact } from "ag-grid-react";

import {
  ModuleRegistry,
  AllCommunityModule,
  type ColDef,
  type GridOptions,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "../styles/datagrid.css";

ModuleRegistry.registerModules([AllCommunityModule]);

type Props<T> = {
  rowData: T[];
  columnDefs: ColDef[];
  pagination?: boolean;
  paginationPageSize?: number;
  paginationPageSizeSelector?: number[];
  gridOptions?: GridOptions;
};

const DataGrid = <T,>({
  rowData,
  columnDefs,
  pagination = true,
  paginationPageSize = 10,
  paginationPageSizeSelector = [10, 25, 50],
  gridOptions,
}: Props<T>) => {
  return (
    <div
      className="ag-theme-quartz"
      style={{ height: "80vh", width: "100%" }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}
        gridOptions={gridOptions}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
        }}
      />
    </div>
  );
};

export default DataGrid;