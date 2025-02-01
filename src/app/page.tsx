"use client";

import { useMemo, useState } from "react";

import type { Column, ColumnFiltersState } from "@tanstack/react-table";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";

type TabType = "review-due" | "review-scheduled" | "mastered";

type Problem = {
    problemId: string;
    name: string;
    progressLevel: string;
    progressPercent: number;
    delay: string;
    status: TabType;
};

const defaultData: Problem[] = [
    {
        problemId: "528",
        name: "Random Pick with Weight",
        progressLevel: "Medium",
        progressPercent: 60,
        delay: "3 hour(s)",
        status: "review-due",
    },
    {
        problemId: "2517",
        name: "Maximum Tastiness of Candy Basket",
        progressLevel: "Medium",
        progressPercent: 20,
        delay: "12 hour(s)",
        status: "review-scheduled",
    },
    {
        problemId: "348",
        name: "Design Tic-Tac-Toe",
        progressLevel: "Medium",
        progressPercent: 20,
        delay: "13 hour(s)",
        status: "mastered",
    },
    {
        problemId: "934",
        name: "Shortest Bridge",
        progressLevel: "Medium",
        progressPercent: 20,
        delay: "14 hour(s)",
        status: "review-scheduled",
    },
    {
        problemId: "1650",
        name: "Lowest Common Ancestor of a Binary Tree III",
        progressLevel: "Medium",
        progressPercent: 60,
        delay: "14 hour(s)",
        status: "review-due",
    },
];

const columnHelper = createColumnHelper<Problem>();

const columns = [
    columnHelper.accessor("name", {
        header: "Problem",
        cell: (info) => (
            <div className="text-orange-500 hover:underline cursor-pointer truncate max-w-[300px]">
                {info.getValue()}
            </div>
        ),
    }),
    columnHelper.accessor("progressLevel", {
        header: "Progress Level",
        cell: (info) => (
            <div className="flex items-center gap-2 w-[200px]">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500"
                        style={{ width: `${info.row.original.progressPercent}%` }}
                    />
                </div>
                <span className="text-orange-500">{info.getValue()}</span>
            </div>
        ),
        enableColumnFilter: false,
    }),
    columnHelper.accessor("delay", {
        header: "Delay",
        cell: (info) => <div className="w-[100px]">{info.getValue()}</div>,
        enableColumnFilter: false,
    }),
    columnHelper.accessor("problemId", {
        header: "Operation",
        cell: () => (
            <div className="flex gap-2 w-[100px]">
                <button className="text-gray-500 hover:text-gray-700">✓</button>
                <button className="text-gray-500 hover:text-gray-700">↻</button>
                <button className="text-gray-500 hover:text-gray-700">□</button>
            </div>
        ),
        enableColumnFilter: false,
    }),
];

const Home: React.FC = () => {
    const [data] = useState(() => [...defaultData]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [activeTab, setActiveTab] = useState<TabType>("review-due");

    const filteredData = useMemo(
        () => data.filter((item) => item.status === activeTab),
        [data, activeTab],
    );

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        state: {
            columnFilters,
        },
    });

    const tabs = useMemo(
        () =>
            [
                { id: "review-due", label: "Review Due" },
                { id: "review-scheduled", label: "Review Scheduled" },
                { id: "mastered", label: "Mastered" },
            ] as const,
        [],
    );

    return (
        <div className="p-2">
            <div className="flex gap-4 mb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg ${
                            activeTab === tab.id
                                ? "bg-white shadow-md"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <table className="border-collapse table-fixed w-[700px]">
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

const Filter: React.FC<{
    column: Column<Problem, unknown> & {
        getFilterValue: () => string;
        setFilterValue: (value: string) => void;
    };
}> = ({ column }) => {
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
