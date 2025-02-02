/* eslint-disable jsx-a11y/click-events-have-key-events */
"use client";

import { useCallback, useMemo, useState } from "react";

import type { ColumnDef, ColumnFiltersState, SortingState } from "@tanstack/react-table";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Filter, RefreshCw } from "lucide-react";
import { toast, Toaster } from "sonner";

import type { RouterOutputs } from "@/backend/routers";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { formatTimeAgo, formatTimeLeft } from "@/shared/time";
import type { ProblemReviewStatus } from "@/shared/types";
import { getLeetcodeProblemUrl } from "@/shared/utils";

import { trpcClient } from "../app/_trpc/client";

const columnHelper = createColumnHelper<RouterOutputs["getProblems"]["reviewDue"][number]>();

const Home: React.FC = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [activeTab, setActiveTab] = useState<ProblemReviewStatus>("reviewDue");
    const [sortingState, setSortingState] = useState<SortingState>([{ id: "pastDue", desc: true }]);
    const [globalFilter, setGlobalFilter] = useState("");

    const { data: problems, refetch: refetchProblems } = trpcClient.getProblems.useQuery();
    const { mutate: syncProblemsMutate, isPending: isSyncing } =
        trpcClient.syncProblems.useMutation({
            onSuccess: () => {
                toast.success("Problems synced successfully!");
                void refetchProblems();
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
                columnHelper.accessor("difficulty", {
                    id: "difficulty",
                    header: ({ column }) => {
                        return (
                            <div className="flex items-center gap-1">
                                <span>Difficulty</span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="hover:bg-gray-100 p-1 rounded-sm focus:outline-none">
                                        <Filter className="h-4 w-4 fill-current" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            onClick={() => column.setFilterValue(null)}
                                            className="text-sm"
                                        >
                                            All
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => column.setFilterValue("Easy")}
                                            className="text-green-500 text-sm"
                                        >
                                            Easy
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => column.setFilterValue("Medium")}
                                            className="text-yellow-500 text-sm"
                                        >
                                            Medium
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => column.setFilterValue("Hard")}
                                            className="text-red-500 text-sm"
                                        >
                                            Hard
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        );
                    },
                    cell: (info) => (
                        <div className="h-[40px] flex items-center">
                            <span
                                className={`
                                ${info.getValue() === "Easy" ? "text-green-500" : ""}
                                ${info.getValue() === "Medium" ? "text-yellow-500" : ""}
                                ${info.getValue() === "Hard" ? "text-red-500" : ""}
                            `}
                            >
                                {info.getValue()}
                            </span>
                        </div>
                    ),
                    enableSorting: false,
                    filterFn: "equals",
                    size: 20,
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
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
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
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Search problems..."
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="h-9 w-[200px]"
                    />
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
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
                <table className="w-full table-fixed border-collapse">
                    <colgroup>
                        <col className="w-[35%]" />
                        <col className="w-[15%]" />
                        <col className="w-[25%]" />
                        <col className="w-[25%]" />
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
                                                    header.column.getCanSort() &&
                                                    header.column.id !== "difficulty"
                                                        ? "cursor-pointer select-none"
                                                        : ""
                                                }`,
                                                onClick:
                                                    header.column.id !== "difficulty"
                                                        ? header.column.getToggleSortingHandler()
                                                        : undefined,
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                            {(header.column.id !== "difficulty" &&
                                                {
                                                    asc: " 🔼",
                                                    desc: " 🔽",
                                                }[header.column.getIsSorted() as string]) ??
                                                null}
                                        </div>
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
            <div className="flex flex-col items-center gap-4 px-2 mt-4">
                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={(e) => {
                                table.setPageSize(Number(e.target.value));
                            }}
                            className="h-8 w-[70px] rounded-md border border-input bg-background"
                        >
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                />
                            </PaginationItem>
                            {/* Show first page */}
                            <PaginationItem>
                                <PaginationLink
                                    onClick={() => table.setPageIndex(0)}
                                    isActive={table.getState().pagination.pageIndex === 0}
                                >
                                    1
                                </PaginationLink>
                            </PaginationItem>
                            {/* Show ellipsis if needed */}
                            {table.getState().pagination.pageIndex > 2 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                            {/* Show current page and surrounding pages */}
                            {table.getState().pagination.pageIndex > 0 &&
                                table.getState().pagination.pageIndex <
                                    table.getPageCount() - 1 && (
                                    <PaginationItem>
                                        <PaginationLink
                                            onClick={() =>
                                                table.setPageIndex(
                                                    table.getState().pagination.pageIndex,
                                                )
                                            }
                                            isActive={true}
                                        >
                                            {table.getState().pagination.pageIndex + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}
                            {/* Show ellipsis if needed */}
                            {table.getState().pagination.pageIndex < table.getPageCount() - 3 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                            {/* Show last page */}
                            {table.getPageCount() > 1 && (
                                <PaginationItem>
                                    <PaginationLink
                                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                        isActive={
                                            table.getState().pagination.pageIndex ===
                                            table.getPageCount() - 1
                                        }
                                    >
                                        {table.getPageCount()}
                                    </PaginationLink>
                                </PaginationItem>
                            )}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
                <div className="text-sm text-muted-foreground">
                    {table.getPrePaginationRowModel().rows.length} total problems
                </div>
            </div>
        </div>
    );
};

export default Home;
