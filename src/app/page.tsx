"use client";

import { useState } from "react";

import type { Column, ColumnFiltersState } from "@tanstack/react-table";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";

type Person = {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    status: string;
    progress: number;
};

const defaultData: Person[] = [
    {
        firstName: "tanner",
        lastName: "linsley",
        age: 24,
        visits: 100,
        status: "In Relationship",
        progress: 50,
    },
    {
        firstName: "tandy",
        lastName: "miller",
        age: 40,
        visits: 40,
        status: "Single",
        progress: 80,
    },
    {
        firstName: "joe",
        lastName: "dirte",
        age: 45,
        visits: 20,
        status: "Complicated",
        progress: 10,
    },
];

const columnHelper = createColumnHelper<Person>();

const columns = [
    columnHelper.accessor("firstName", {
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.lastName, {
        id: "lastName",
        cell: (info) => <i>{info.getValue()}</i>,
        header: () => <span>Last Name</span>,
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor("age", {
        header: () => "Age",
        cell: (info) => info.renderValue(),
        footer: (info) => info.column.id,
        enableColumnFilter: false,
    }),
    columnHelper.accessor("visits", {
        header: () => <span>Visits</span>,
        footer: (info) => info.column.id,
        enableColumnFilter: false,
    }),
    columnHelper.accessor("status", {
        header: "Status",
        footer: (info) => info.column.id,
        enableColumnFilter: false,
    }),
    columnHelper.accessor("progress", {
        header: "Profile Progress",
        footer: (info) => info.column.id,
        enableColumnFilter: false,
    }),
];

const Home: React.FC = () => {
    const [data] = useState(() => [...defaultData]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        state: {
            columnFilters,
        },
    });

    return (
        <div className="p-2">
            <table className="border-collapse">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="border border-slate-300 p-2">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                    {header.column.getCanFilter() ? (
                                        <div>
                                            <Filter column={header.column} />
                                        </div>
                                    ) : null}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="border border-slate-300 p-2">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="h-4" />
        </div>
    );
};

const Filter: React.FC<{ column: Column<Person, unknown> }> = ({ column }) => {
    const columnFilterValue = column.getFilterValue();

    return (
        <input
            type="text"
            value={(columnFilterValue ?? "") as string}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder="Search..."
            className="w-36 border shadow rounded p-1"
        />
    );
};

export default Home;
