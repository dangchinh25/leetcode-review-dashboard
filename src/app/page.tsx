/* eslint-disable jsx-a11y/click-events-have-key-events */
"use client";

import { useMemo, useState } from "react";

import type { Column, ColumnDef, ColumnFiltersState, SortingState } from "@tanstack/react-table";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import type { RouterOutputs } from "@/backend/routers";
import { formatTimeAgo, formatTimeLeft } from "@/shared/time";
import type { ProblemReviewStatus } from "@/shared/types";

import { trpcClient } from "../app/_trpc/client";

const columnHelper = createColumnHelper<RouterOutputs["getProblems"]["reviewDue"][number]>();

const Home: React.FC = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [activeTab, setActiveTab] = useState<ProblemReviewStatus>("reviewDue");
    const [sortingState, setSortingState] = useState<SortingState>([
        { id: "pastDue", desc: false },
    ]);

    const { data: problems } = trpcClient.getProblems.useQuery();

    const filteredData = useMemo(() => {
        return problems ? problems[activeTab] || [] : [];
    }, [problems, activeTab]);

    const baseColumns: ColumnDef<RouterOutputs["getProblems"]["reviewDue"][number], any>[] = [
        columnHelper.accessor("title", {
            id: "problemTitle",
            header: "Problem",
            cell: (info) => (
                <div className="text-orange-500 hover:underline cursor-pointer truncate h-[40px] flex items-center">
                    {info.getValue()}
                </div>
            ),
            size: 40,
        }),
        columnHelper.accessor("proficiency.proficiency", {
            id: "proficiency",
            header: "Proficiency",
            cell: (info) => (
                <div className="flex items-center gap-2 h-[40px]">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500"
                            style={{ width: `${info.row.original.proficiency.proficiency * 20}%` }}
                        />
                    </div>
                    <span className="text-orange-500">{info.getValue()}/5</span>
                </div>
            ),
            enableColumnFilter: false,
            size: 30,
        }),
    ];

    const getDynamicColumns = (activeTab: ProblemReviewStatus) => {
        const dynamicColumns = [...baseColumns];

        if (activeTab === "reviewDue") {
            dynamicColumns.push(
                columnHelper.accessor("proficiency.nextReviewTime", {
                    id: "pastDue",
                    header: "Past Due",
                    cell: (info) => {
                        const nextReviewTime = parseInt(info.getValue() as string);
                        return (
                            <div className="h-[40px] flex items-center">
                                {formatTimeAgo(nextReviewTime)}
                            </div>
                        );
                    },
                    enableColumnFilter: false,
                    size: 30,
                }),
            );
        } else if (activeTab === "reviewScheduled") {
            dynamicColumns.push(
                columnHelper.accessor("proficiency.nextReviewTime", {
                    id: "reviewScheduled",
                    header: "Review Scheduled",
                    cell: (info) => {
                        const nextReviewTime = parseInt(info.getValue() as string);

                        return (
                            <div className="h-[40px] flex flex-col justify-center">
                                <div>
                                    {new Date(nextReviewTime).toLocaleString(undefined, {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {formatTimeLeft(nextReviewTime)}
                                </div>
                            </div>
                        );
                    },
                    enableColumnFilter: false,
                    size: 30,
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
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        state: {
            columnFilters,
        },
        initialState: {
            sorting: sortingState,
            pagination: {
                pageSize: 20,
            },
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

    const onChangeActiveTab = (tabId: ProblemReviewStatus) => {
        setActiveTab(tabId);

        if (tabId === "reviewDue") {
            setSortingState([{ id: "pastDue", desc: false }]);
        } else if (tabId === "reviewScheduled") {
            setSortingState([{ id: "reviewScheduled", desc: false }]);
        } else if (tabId === "mastered") {
            setSortingState([]);
        }
    };

    return (
        <div className="p-2">
            <div className="flex gap-4 mb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onChangeActiveTab(tab.id)}
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
            <div className="overflow-x-auto">
                <table className="w-full table-fixed border-collapse">
                    <colgroup>
                        <col className="w-[40%]" />
                        <col className="w-[30%]" />
                        <col className="w-[30%]" />
                    </colgroup>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="border border-slate-300 p-2 text-left"
                                    >
                                        <div
                                            {...{
                                                className: `${
                                                    header.column.getCanSort()
                                                        ? "cursor-pointer select-none"
                                                        : ""
                                                }`,
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                            {{
                                                asc: " 🔼",
                                                desc: " 🔽",
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
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
                                    <td
                                        key={cell.id}
                                        className="border border-slate-300 p-2 align-middle"
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center gap-2">
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {"<<"}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {"<"}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {">"}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {">>"}
                </button>
                <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </strong>
                </span>
                <span className="flex items-center gap-1">
                    | Go to page:
                    <input
                        type="number"
                        min="1"
                        max={table.getPageCount()}
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            table.setPageIndex(page);
                        }}
                        className="border p-1 rounded w-16"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
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
