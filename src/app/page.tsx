/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Ban, Filter, Play, RefreshCw, RotateCw, Shuffle, Tags, X } from "lucide-react";
import { toast, Toaster } from "sonner";

import type { RouterOutputs } from "@/backend/routers";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatTimeAgo, formatTimeLeft } from "@/shared/time";
import type { ProblemReviewStatus } from "@/shared/types";
import { getLeetcodeProblemUrl } from "@/shared/utils";
import { isProblemMastered } from "@/shared/utils/reviews";

import { trpcClient } from "../app/_trpc/client";

const columnHelper = createColumnHelper<RouterOutputs["getProblems"]["reviewDue"][number]>();

const Home: React.FC = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [activeTab, setActiveTab] = useState<ProblemReviewStatus>("reviewDue");
    const [sortingState, setSortingState] = useState<SortingState>([{ id: "pastDue", desc: true }]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [showTags, setShowTags] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogContent, setDialogContent] = useState("");

    const [currentSyncingProblem, setCurrentSyncingProblem] = useState<string | null>(null);
    const [currentCancellingProblem, setCurrentCancellingProblem] = useState<string | null>(null);

    const [selectedProblem, setSelectedProblem] = useState<
        RouterOutputs["getProblems"]["reviewDue"][number] | null
    >(null);
    const [problemDialogOpen, setProblemDialogOpen] = useState(false);

    const openDialog = (title: string, content: string) => {
        setDialogTitle(title);
        setDialogContent(content);
        setDialogOpen(true);
    };

    const { data: problems, refetch: refetchProblems } = trpcClient.getProblems.useQuery();
    const { mutate: syncProblemsMutate, isPending: isSyncing } =
        trpcClient.syncProblems.useMutation({
            onSuccess: (data) => {
                if (data.success && "updatedProblemProficiencies" in data) {
                    const updatedProblems = data.updatedProblemProficiencies;

                    toast.success(
                        <div
                            onClick={() => {
                                if (updatedProblems.length > 0) {
                                    openDialog(
                                        "Problems synced successfully!",
                                        `Details:\n${updatedProblems.map((p) => p.title).join("\n")}`,
                                    );
                                }
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            Problems synced successfully!
                            <div className="text-sm">{`${updatedProblems.length} problems updated. ${updatedProblems.length > 0 ? "Click to view details" : ""}`}</div>
                        </div>,
                    );
                    void refetchProblems();
                } else if (!data.success && "error" in data) {
                    toast.error(
                        <div
                            onClick={() => {
                                openDialog(
                                    "Failed to sync problems",
                                    `Failed to sync problems: ${data.error}`,
                                );
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            Failed to sync problems
                        </div>,
                    );
                }
            },
            onError: (error) => {
                toast.error(
                    <div
                        onClick={() => {
                            openDialog(
                                "Failed to sync problems",
                                `Failed to sync problems: ${error.message}`,
                            );
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        Failed to sync problems: {error.message}
                    </div>,
                );
            },
        });
    const { mutate: syncProblemMutate, isPending: isSyncingProblem } =
        trpcClient.syncProblem.useMutation({
            onMutate: (variables) => {
                setCurrentSyncingProblem(variables.titleSlug);
            },
            onSettled: () => {
                setCurrentSyncingProblem(null);
            },
            onSuccess: (data) => {
                if (data.success && "problem" in data) {
                    const updatedProblem = data.problem;

                    toast.success(
                        <div
                            onClick={() => {
                                openDialog(
                                    "Problem synced successfully!",
                                    `Details:\n${JSON.stringify(updatedProblem, null, 2)}`, // TODO: Display in a better way
                                );
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            Problems synced successfully!
                            <div className="text-sm">{`${updatedProblem.title} updated.`}</div>
                        </div>,
                    );
                    void refetchProblems();
                } else if (!data.success && "error" in data) {
                    toast.error(
                        <div
                            onClick={() => {
                                openDialog(
                                    "Failed to sync problems",
                                    `Failed to sync problems: ${data.error}`,
                                );
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            Failed to sync problems
                        </div>,
                    );
                }
            },
            onError: (error) => {
                toast.error(
                    <div
                        onClick={() => {
                            openDialog(
                                "Failed to sync problems",
                                `Failed to sync problems: ${error.message}`,
                            );
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        Failed to sync problems: {error.message}
                    </div>,
                );
            },
        });
    const { mutate: cancelProblemProficiencyTrackingMutate, isPending: isCancelling } =
        trpcClient.cancelProblemProficiencyTracking.useMutation({
            onMutate: (variables) => {
                setCurrentCancellingProblem(variables.titleSlug);
            },
            onSuccess: (info) => {
                if (info.success && "problem" in info) {
                    const updatedProblem = info.problem;

                    toast.success(
                        `Problem proficiency tracking cancelled: ${updatedProblem.title}`,
                    );
                    void refetchProblems();
                }
            },
            onSettled: () => {
                setCurrentCancellingProblem(null);
            },
            onError: (error) => {
                toast.error(`Failed to cancel problem proficiency tracking: ${error.message}`);
            },
        });
    const { mutate: resumeProblemProficiencyTrackingMutate, isPending: isResuming } =
        trpcClient.resumeTrackingProblem.useMutation({
            onSuccess: (info) => {
                if (info.success && "problem" in info) {
                    const updatedProblem = info.problem;
                    toast.success(`Problem proficiency tracking resumed: ${updatedProblem.title}`);
                    void refetchProblems();
                }
            },
            onError: (error) => {
                toast.error(`Failed to resume problem proficiency tracking: ${error.message}`);
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
                    cell: (info) => {
                        return (
                            <div
                                className={`flex flex-col justify-center ${showTags ? "py-2" : "h-8"}`}
                            >
                                <a
                                    href={getLeetcodeProblemUrl(info.row.original.titleSlug)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    {info.getValue()}
                                </a>
                                {showTags && info.row.original.tags && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {info.row.original.tags.map((tag) => (
                                            <span
                                                key={tag.slug}
                                                className="px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-full text-xs font-medium"
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    },
                    size: 55,
                    minSize: undefined,
                    maxSize: undefined,
                    enableResizing: false,
                }),
                columnHelper.accessor("difficulty", {
                    id: "difficulty",
                    header: ({ column }) => {
                        const currentFilterValue = column.getFilterValue() as string;
                        return (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Difficulty
                                </span>
                                {currentFilterValue && (
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            currentFilterValue === "Easy"
                                                ? "bg-green-100 text-green-700"
                                                : currentFilterValue === "Medium"
                                                  ? "bg-yellow-100 text-yellow-700"
                                                  : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {currentFilterValue}
                                    </span>
                                )}
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
            [showTags],
        );

    const getDynamicColumns = useCallback(
        (activeTab: ProblemReviewStatus) => {
            const dynamicColumns = [...baseColumns.filter((col) => col.id !== "operations")];

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

            dynamicColumns.push(
                columnHelper.accessor("titleSlug", {
                    id: "operations",
                    header: "Operations",
                    cell: (info) => (
                        <div className="flex items-center gap-2 h-8">
                            {/* Sync problem button */}
                            <button
                                className="p-1 text-muted-foreground hover:bg-muted rounded-full transition-colors group relative disabled:opacity-50"
                                onClick={() =>
                                    syncProblemMutate({ titleSlug: info.row.original.titleSlug })
                                }
                                disabled={
                                    isSyncingProblem &&
                                    currentSyncingProblem === info.row.original.titleSlug
                                }
                            >
                                <RotateCw
                                    className={`w-4 h-4 ${isSyncingProblem && currentSyncingProblem === info.row.original.titleSlug ? "animate-spin" : ""}`}
                                />
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {isSyncingProblem &&
                                    currentSyncingProblem === info.row.original.titleSlug
                                        ? "Syncing..."
                                        : "Sync Problem"}
                                </span>
                            </button>
                            {/* Resume tracking button */}
                            {activeTab === "notTracking" && (
                                <button
                                    className="p-1 text-muted-foreground hover:bg-muted rounded-full transition-colors group relative"
                                    onClick={() => {
                                        resumeProblemProficiencyTrackingMutate({
                                            titleSlug: info.row.original.titleSlug,
                                        });
                                    }}
                                    disabled={isResuming}
                                >
                                    <Play className="w-4 h-4" />
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {isResuming ? "Resuming..." : "Resume Tracking"}
                                    </span>
                                </button>
                            )}
                            {/* Cancel tracking button */}
                            <button
                                className="p-1 text-muted-foreground hover:bg-muted rounded-full transition-colors group relative"
                                onClick={() => {
                                    cancelProblemProficiencyTrackingMutate({
                                        titleSlug: info.row.original.titleSlug,
                                    });
                                }}
                                disabled={
                                    (isCancelling &&
                                        currentCancellingProblem === info.row.original.titleSlug) ||
                                    isProblemMastered({
                                        proficiency: info.row.original.proficiency.proficiency,
                                    }) ||
                                    info.row.original.proficiency.isTracking === false
                                }
                            >
                                <Ban className="w-4 h-4" />
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {isProblemMastered({
                                        proficiency: info.row.original.proficiency.proficiency,
                                    }) || info.row.original.proficiency.isTracking === false
                                        ? "Cancel tracking not supported"
                                        : "Stop Tracking"}
                                </span>
                            </button>
                            {/* Reset tracking button */}
                            <button
                                className="p-1 text-muted-foreground hover:bg-muted rounded-full transition-colors group relative"
                                onClick={() => {
                                    // TODO: Implement reset tracking
                                    console.log("Reset tracking for:", info.row.original.titleSlug);
                                }}
                                disabled={
                                    !info.row.original.proficiency.isTracking ||
                                    info.row.original.proficiency.proficiency === 0
                                }
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {!info.row.original.proficiency.isTracking
                                        ? "Continue tracking and reset progress"
                                        : "Reset Progress"}
                                </span>
                            </button>
                        </div>
                    ),
                    enableColumnFilter: false,
                    enableSorting: false,
                    size: 15,
                    minSize: undefined,
                    maxSize: undefined,
                    enableResizing: false,
                }),
            );

            return dynamicColumns;
        },
        [
            baseColumns,
            currentSyncingProblem,
            isSyncingProblem,
            syncProblemMutate,
            currentCancellingProblem,
            isCancelling,
            cancelProblemProficiencyTrackingMutate,
            isResuming,
            resumeProblemProficiencyTrackingMutate,
        ],
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
            { id: "notTracking", label: "Not Tracking" },
        ],
        [],
    );

    const onChangeActiveTab = (tabId: ProblemReviewStatus) => {
        setSortingState(() => {
            let newState: SortingState = [];

            if (tabId === "reviewDue") {
                newState = [{ id: "pastDue", desc: true }];
            } else if (tabId === "reviewScheduled") {
                newState = [{ id: "reviewScheduled", desc: false }];
            } else if (tabId === "mastered") {
                newState = [];
            } else if (tabId === "notTracking") {
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
                return "w-[30%] md:w-[35%] lg:w-[40%]";
            case "difficulty":
                return "w-[15%] md:w-[12%] lg:w-[10%]";
            case "proficiency":
                return "w-[15%] md:w-[12%] lg:w-[10%]";
            case "pastDue":
            case "reviewScheduled":
                return "w-[20%] md:w-[17%] lg:w-[15%]";
            case "operations":
                return "w-[20%] md:w-[17%] lg:w-[15%]";
            default:
                return "";
        }
    };

    const handleRandomProblem = useCallback(() => {
        if (problems && problems.reviewDue && problems.reviewDue.length > 0) {
            const randomIndex = Math.floor(Math.random() * problems.reviewDue.length);
            const randomProblem = problems.reviewDue[randomIndex];
            setSelectedProblem(randomProblem);
            setProblemDialogOpen(true);
        } else {
            toast.error("No problems due for review!");
        }
    }, [problems]);

    return (
        <div className="p-2 sm:p-4 md:p-6 lg:p-8 w-[98%] sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[75%] mx-auto">
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
                <div className="flex items-center gap-4">
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
                    {activeTab === "reviewDue" && (
                        <button
                            onClick={handleRandomProblem}
                            className="p-1.5 text-muted-foreground hover:bg-muted rounded-full transition-colors group relative"
                            disabled={!problems?.reviewDue || problems.reviewDue.length === 0}
                        >
                            <Shuffle className="w-5 h-5" />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Random Problem
                            </span>
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Input
                            placeholder="Search problems..."
                            value={globalFilter ?? ""}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="h-9 w-[200px] pr-8"
                        />
                        {globalFilter && (
                            <button
                                onClick={() => setGlobalFilter("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-full"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <button
                        className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors group relative"
                        onClick={() => {}}
                    >
                        <Filter className="w-6 h-6" />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Filter Tags
                        </span>
                    </button>
                    <button
                        className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors group relative"
                        onClick={() => setShowTags(!showTags)}
                    >
                        <Tags className="w-6 h-6" />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {showTags ? "Hide Tags" : "Show Tags"}
                        </span>
                    </button>
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
                                            className={`px-4 ${
                                                showTags ? "py-2" : "py-4"
                                            } align-middle border-r border-gray-200 [&:has([role=checkbox])]:pr-0 ${getColumnWidthClass(cell.column.id)}`}
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
            <div className="flex items-center justify-center gap-6 px-2 mt-4">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows:</p>
                    <Select
                        value={table.getState().pagination.pageSize.toString()}
                        onValueChange={(value) => table.setPageSize(Number(value))}
                    >
                        <SelectTrigger className="h-8 w-[70px] rounded-md border border-input bg-background">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {["10", "20", "30", "40", "50"].map((pageSize) => (
                                <SelectItem key={pageSize} value={pageSize}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
                            table.getState().pagination.pageIndex < table.getPageCount() - 1 && (
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
                <div className="text-sm text-muted-foreground">
                    {table.getPrePaginationRowModel().rows.length} total problems
                </div>
            </div>
            {/* Problem Dialog */}
            {selectedProblem && (
                <Dialog open={problemDialogOpen} onOpenChange={setProblemDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                                <span>{selectedProblem.title}</span>
                                <span
                                    className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                                        selectedProblem.difficulty === "Easy"
                                            ? "bg-green-100 text-green-700"
                                            : selectedProblem.difficulty === "Medium"
                                              ? "bg-yellow-100 text-yellow-700"
                                              : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {selectedProblem.difficulty}
                                </span>
                            </DialogTitle>
                            <DialogDescription>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                            Proficiency
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary"
                                                    style={{
                                                        width: `${selectedProblem.proficiency.proficiency * 20}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-muted-foreground whitespace-nowrap">
                                                {selectedProblem.proficiency.proficiency}/5
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                            Past Due
                                        </h4>
                                        <p>
                                            {formatTimeAgo(
                                                Number(selectedProblem.proficiency.nextReviewTime),
                                            )}
                                        </p>
                                    </div>

                                    {selectedProblem.tags && selectedProblem.tags.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                                Tags
                                            </h4>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {selectedProblem.tags.map((tag) => (
                                                    <span
                                                        key={tag.slug}
                                                        className="px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-full text-xs font-medium"
                                                    >
                                                        {tag.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md text-sm font-medium transition-colors"
                                onClick={() => setProblemDialogOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                                onClick={handleRandomProblem}
                            >
                                <Shuffle className="w-4 h-4" />
                                Next Random
                            </button>
                            <a
                                href={getLeetcodeProblemUrl(selectedProblem.titleSlug)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
                                onClick={() => setProblemDialogOpen(false)}
                            >
                                Open Problem
                            </a>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            {dialogOpen && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{dialogTitle}</DialogTitle>
                            <DialogDescription>{dialogContent}</DialogDescription>
                        </DialogHeader>
                        <DialogClose />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default Home;
