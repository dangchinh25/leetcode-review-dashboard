"use client";

import { useMemo, useState } from "react";

import type { Column, ColumnDef, ColumnFiltersState } from "@tanstack/react-table";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";

import type { RouterOutputs } from "@/backend/routers";
import type { ProblemReviewStatus } from "@/shared/types";

import { trpcClient } from "../app/_trpc/client";

const columnHelper = createColumnHelper<RouterOutputs["getProblems"]["reviewDue"][number]>();

const Home: React.FC = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [activeTab, setActiveTab] = useState<ProblemReviewStatus>("reviewDue");

    const { data: problems } = trpcClient.getProblems.useQuery();

    const filteredData = useMemo(() => {
        return problems ? problems[activeTab] || [] : [];
    }, [problems, activeTab]);

    const baseColumns: ColumnDef<RouterOutputs["getProblems"]["reviewDue"][number], any>[] = [
        columnHelper.accessor("title", {
            header: "Problem",
            cell: (info) => (
                <div className="text-orange-500 hover:underline cursor-pointer truncate max-w-[300px]">
                    {info.getValue()}
                </div>
            ),
        }),
        columnHelper.accessor("proficiency.proficiency", {
            header: "Proficiency",
            cell: (info) => (
                <div className="flex items-center gap-2 w-[200px]">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500"
                            style={{ width: `${info.row.original.proficiency.proficiency}%` }}
                        />
                    </div>
                    <span className="text-orange-500">{info.getValue()}</span>
                </div>
            ),
            enableColumnFilter: false,
        }),
    ];

    const getDynamicColumns = (activeTab: ProblemReviewStatus) => {
        const dynamicColumns = [...baseColumns];

        if (activeTab === "reviewDue") {
            dynamicColumns.push(
                columnHelper.accessor("proficiency.nextReviewTime", {
                    header: "Past Due",
                    cell: (info) => {
                        const nextReviewTime = parseInt(info.getValue());
                        const timeAgo = Math.floor(
                            (Date.now() - nextReviewTime) / (1000 * 60 * 60),
                        ); // hours
                        return <div>{timeAgo} hours ago</div>;
                    },
                    enableColumnFilter: false,
                }),
            );
        } else if (activeTab === "reviewScheduled") {
            dynamicColumns.push(
                columnHelper.accessor("proficiency.nextReviewTime", {
                    header: "Review Scheduled",
                    cell: (info) => {
                        const nextReviewTime = parseInt(info.getValue());
                        const date = new Date(nextReviewTime);
                        return <div>{date.toLocaleDateString()}</div>;
                    },
                    enableColumnFilter: false,
                }),
            );
        }

        return dynamicColumns;
    };

    const columns = useMemo(() => getDynamicColumns(activeTab), [activeTab]);

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

    const tabs = useMemo<{ id: ProblemReviewStatus; label: string }[]>(
        () => [
            { id: "reviewDue", label: "Review Due" },
            { id: "reviewScheduled", label: "Review Scheduled" },
            { id: "mastered", label: "Mastered" },
        ],
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
    column: Column<RouterOutputs["getProblems"]["reviewDue"][number], unknown> & {
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
