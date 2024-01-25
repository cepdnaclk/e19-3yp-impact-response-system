import React from "react";
import styles from "./ImpactHistoryTable.module.scss"; // Import your styles
import { Impact } from "../../../../types";

import {
  flexRender,
  ColumnDef,
  // createColumnHelper,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FaSort } from "react-icons/fa";
import { useAppState } from "../../../../states/appState";

const columns: ColumnDef<Impact>[] = [
  {
    accessorKey: "magnitude",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Magnitude <FaSort className={styles.icon} />
        </button>
      );
    },
    size: 2, // Adjust column sizes as needed
    cell: ({ row }) => row.getValue("magnitude") + " g",
  },
  {
    accessorKey: "direction",
    header: "Direction",
    size: 80, // Adjust column sizes as needed
  },
  {
    accessorKey: "timestamp",
    header: "Time",
    size: 30, // Adjust column sizes as needed
    cell: ({ row }) => new Date(row.getValue("timestamp")).toLocaleTimeString(),
  },
];
const ImpactHistoryTable: React.FC<{
  playerId: number;
}> = ({ playerId }) => {
  const impactHistory = useAppState(
    (state) => state.playersImpactHistory[playerId] as Impact[]
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data: impactHistory,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <table className={styles.impactHistoryTable}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ImpactHistoryTable;
