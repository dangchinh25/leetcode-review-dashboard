/* eslint-disable jsx-a11y/click-events-have-key-events */
"use client";

import { useCallback, useMemo, useState } from "react";

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
import { RefreshCw } from "lucide-react";
import { toast, Toaster } from "sonner";

import type { RouterOutputs } from "@/backend/routers";
import { formatTimeAgo, formatTimeLeft } from "@/shared/time";
import type { ProblemReviewStatus } from "@/shared/types";
import { getLeetcodeProblemUrl } from "@/shared/utils";

import { trpcClient } from "../app/_trpc/client";

const columnHelper = createColumnHelper<RouterOutputs["getProblems"]["reviewDue"][number]>();

const Home: React.FC = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [activeTab, setActiveTab] = useState<ProblemReviewStatus>("reviewDue");
    const [sortingState, setSortingState] = useState<SortingState>([
        { id: "pastDue", desc: false },
    ]);

    const { data: problems } = trpcClient.getProblems.useQuery();
    const { mutate: syncProblemsMutate, isPending: isSyncing } =
        trpcClient.syncProblems.useMutation({
            onSuccess: () => {
                toast.success("Problems synced successfully!");
            },
            onError: (error) => {
                toast.error(`Failed to sync problems: ${error.message}`);
            },
        });

    const filteredData = useMemo(() => {
        return problems ? problems[activeTab] || [] : [];
    }, [problems, activeTab]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseColumns: ColumnDef<RouterOutputs["getProblems"]["reviewDue"][number], any>[] =
        useMemo(
            () => [
                columnHelper.accessor("title", {
                    id: "problemTitle",
                    header: "Problem",
                    cell: (info) => (
                        <div className="truncate h-[40px] flex items-center">
                            <a
                                href={getLeetcodeProblemUrl(info.row.original.titleSlug)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-500 hover:underline cursor-pointer"
                            >
                                {info.getValue()}
                            </a>
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
                                    style={{
                                        width: `${info.row.original.proficiency.proficiency * 20}%`,
                                    }}
                                />
                            </div>
                            <span className="text-orange-500">{info.getValue()}/5</span>
                        </div>
                    ),
                    enableColumnFilter: false,
                    size: 30,
                }),
            ],
            [],
        );

    const getDynamicColumns = useCallback(
        (activeTab: ProblemReviewStatus) => {
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
        },
        [baseColumns],
    );

    const columns = useMemo(() => getDynamicColumns(activeTab), [activeTab, getDynamicColumns]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSortingState,
        onColumnFiltersChange: setColumnFilters,
        state: {
            columnFilters,
            sorting: sortingState,
        },
        initialState: {
            pagination: {
                pageSize: 10,
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
        setSortingState(() => {
            let newState: SortingState = [];

            if (tabId === "reviewDue") {
                newState = [{ id: "pastDue", desc: false }];
            } else if (tabId === "reviewScheduled") {
                console.log("reviewScheduled");
                newState = [{ id: "reviewScheduled", desc: false }];
            } else if (tabId === "mastered") {
                newState = [];
            }

            setActiveTab(tabId);
            return newState;
        });
    };

    return (
        <div className="p-8 w-[70%] mx-auto">
            <Toaster
                position="bottom-right"
                theme="light"
                toastOptions={{
                    style: {
                        fontSize: "1rem",
                        padding: "12px",
                        minWidth: "280px",
                    },
                }}
            />
            <div className="flex justify-between items-center mb-8">
                <div className="flex justify-center gap-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onChangeActiveTab(tab.id)}
                            className={`px-6 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${
                                activeTab === tab.id
                                    ? "bg-white shadow-lg scale-105 text-orange-500 border-b-2 border-orange-500"
                                    : "text-gray-600 hover:bg-gray-100 hover:scale-102"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <button
                    className="p-2 text-orange-500 hover:bg-orange-50 rounded-full transition-colors group relative disabled:opacity-50"
                    onClick={() => syncProblemsMutate()}
                    disabled={isSyncing}
                >
                    <RefreshCw className={`w-6 h-6 ${isSyncing ? "animate-spin" : ""}`} />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {isSyncing ? "Syncing..." : "Sync Problems"}
                    </span>
                </button>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
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
            <div className="flex items-center justify-center gap-2 mt-4">
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
            <div className="mt-2 text-center">
                {table.getPrePaginationRowModel().rows.length} Rows
            </div>
        </div>
    );
};

interface FilterProps {
    column: Column<RouterOutputs["getProblems"]["reviewDue"][number], unknown> & {
        getFilterValue: () => string | number;
        setFilterValue: (value: string) => void;
    };
}

const Filter = ({ column }: FilterProps) => {
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
