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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

    const baseColumns: ColumnDef<RouterOutputs["getProblems"]["reviewDue"][number], any>[] =
        useMemo(
            () => [
                columnHelper.accessor("title", {
                    id: "problemTitle",
                    header: "Problem",
                    cell: (info) => (
                        <div className="flex items-center h-8">
                            <a
                                href={getLeetcodeProblemUrl(info.row.original.titleSlug)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                {info.getValue()}
                            </a>
                        </div>
                    ),
                    size: 55,
                    minSize: undefined,
                    maxSize: undefined,
                    enableResizing: false,
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
                        <div className="flex items-center h-8">
                            <span
                                className={`font-medium ${
                                    info.getValue() === "Easy"
                                        ? "text-green-500"
                                        : info.getValue() === "Medium"
                                          ? "text-yellow-500"
                                          : "text-red-500"
                                }`}
                            >
                                {info.getValue()}
                            </span>
                        </div>
                    ),
                    enableSorting: false,
                    filterFn: "equals",
                    size: 15,
                    minSize: undefined,
                    maxSize: undefined,
                    enableResizing: false,
                }),
                columnHelper.accessor("proficiency.proficiency", {
                    id: "proficiency",
                    header: "Proficiency",
                    cell: (info) => (
                        <div className="flex items-center gap-2 h-8">
                            <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary"
                                    style={{
                                        width: `${info.row.original.proficiency.proficiency * 20}%`,
                                    }}
                                />
                            </div>
                            <span className="text-muted-foreground">{info.getValue()}/5</span>
                        </div>
                    ),
                    enableColumnFilter: false,
                    size: 15,
                    minSize: undefined,
                    maxSize: undefined,
                    enableResizing: false,
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
                        cell: (info) => (
                            <div className="flex items-center text-muted-foreground h-8">
                                {formatTimeAgo(Number(info.getValue()))}
                            </div>
                        ),
                        enableColumnFilter: false,
                        size: 15,
                        minSize: undefined,
                        maxSize: undefined,
                        enableResizing: false,
                    }),
                );
            } else if (activeTab === "reviewScheduled") {
                dynamicColumns.push(
                    columnHelper.accessor("proficiency.nextReviewTime", {
                        id: "reviewScheduled",
                        header: "Review Scheduled",
                        cell: (info) => {
                            const nextReviewTime = Number(info.getValue());
                            return (
                                <div className="flex flex-col justify-center h-8">
                                    <div className="text-sm">
                                        {new Date(nextReviewTime).toLocaleString(undefined, {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {formatTimeLeft(nextReviewTime)}
                                    </div>
                                </div>
                            );
                        },
                        enableColumnFilter: false,
                        size: 15,
                        minSize: undefined,
                        maxSize: undefined,
                        enableResizing: false,
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

    // First, let's create a helper function to get column width class
    const getColumnWidthClass = (columnId: string) => {
        switch (columnId) {
            case "problemTitle":
                return "w-[40%]";
            case "difficulty":
                return "w-[20%]";
            case "proficiency":
                return "w-[20%]";
            case "pastDue":
            case "reviewScheduled":
                return "w-[20%]";
            default:
                return "";
        }
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
                <Tabs
                    value={activeTab}
                    onValueChange={(value) => onChangeActiveTab(value as ProblemReviewStatus)}
                    className="w-fit"
                >
                    <TabsList className="h-9">
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="px-4 h-8 text-sm font-medium"
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Search problems..."
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="h-9 w-[200px]"
                    />
                    <button
                        className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors group relative disabled:opacity-50"
                        onClick={() => syncProblemsMutate()}
                        disabled={isSyncing}
                    >
                        <RefreshCw className={`w-6 h-6 ${isSyncing ? "animate-spin" : ""}`} />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {isSyncing ? "Syncing..." : "Sync Problems"}
                        </span>
                    </button>
                </div>
            </div>
            <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                    <table className="w-full table-fixed caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="border-b transition-colors">
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className={`h-8 px-4 text-left align-middle font-medium text-muted-foreground border-r border-gray-200 [&:has([role=checkbox])]:pr-0 ${getColumnWidthClass(header.column.id)}`}
                                        >
                                            <div
                                                {...{
                                                    className: `${
                                                        header.column.getCanSort() &&
                                                        header.column.id !== "difficulty"
                                                            ? "cursor-pointer select-none flex items-center gap-1"
                                                            : "flex items-center gap-1"
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
                                                {header.column.getCanSort() &&
                                                    header.column.id !== "difficulty" && (
                                                        <span className="text-xs text-muted-foreground">
                                                            {{
                                                                asc: "↑",
                                                                desc: "↓",
                                                            }[
                                                                header.column.getIsSorted() as string
                                                            ] ?? "↕"}
                                                        </span>
                                                    )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-b transition-colors hover:bg-muted/50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className={`p-4 align-middle border-r border-gray-200 [&:has([role=checkbox])]:pr-0 ${getColumnWidthClass(cell.column.id)}`}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
