"use client";

import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import React, { ReactNode, useState } from "react";


export type ColumnType<T> = {
    header: string;
    accessor: keyof T | string;
    render?: (item: T) => ReactNode;
    className?: string;
};

type CommonTableProps<T> = {
    columns: ColumnType<T>[];
    data: T[];
    isLoading?: boolean;
    skeletonRows?: number;
    emptyMessage?: string;
    expandable?: boolean;
    renderExpandedRow?: (item: T) => ReactNode;

    page?: number;
    totalPages?: number;
    totalRows?: number;
    limit?: number;
    onPageChange?: (page: number) => void;
};

const CommonTable = <T extends { id: number | string }>({
    columns,
    data,
    isLoading = false,
    skeletonRows = 5,
    emptyMessage = "No data found",
    expandable = false,
    renderExpandedRow,

    page = 1,
    totalPages = 1,
    totalRows = 0,
    limit = 10,
    onPageChange,
}: CommonTableProps<T>) => {
    const [expandedRow, setExpandedRow] = useState<number | string | null>(null);

    const handleExpand = (id: number | string) => {
        setExpandedRow((prev) => (prev === id ? null : id));
    };

    return (
        <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={`px-4 py-4 text-left text-sm font-semibold ${column.className || ""
                                        }`}
                                >
                                    {column.header}
                                </th>
                            ))}

                            {expandable && (
                                <th className="w-[70px] px-4 py-2"></th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            Array.from({ length: skeletonRows }).map((_, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-200 animate-pulse"
                                >
                                    {columns.map((_, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className="px-4 py-2"
                                        >
                                            <div className="h-4 w-full max-w-[120px] rounded bg-gray-200" />
                                        </td>
                                    ))}

                                    {expandable && (
                                        <td className="px-4 py-2">
                                            <div className="mx-auto h-5 w-5 rounded bg-gray-200" />
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : data.length > 0 ? (
                            data.map((item) => (
                                <React.Fragment key={item.id}>
                                    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                        {columns.map((column, index) => (
                                            <td
                                                key={index}
                                                className={`px-4 py-2 text-sm ${column.className || ""
                                                    }`}
                                            >
                                                {column.render
                                                    ? column.render(item)
                                                    : String(
                                                        item[
                                                        column.accessor as keyof T
                                                        ]
                                                    )}
                                            </td>
                                        ))}

                                        {expandable && (
                                            <td className="px-4 py-2">
                                                <button
                                                    onClick={() =>
                                                        handleExpand(item.id)
                                                    }
                                                    className="mx-auto flex items-center justify-center rounded-full p-1 hover:bg-gray-200 transition-colors"
                                                >
                                                    {expandedRow === item.id ? (
                                                        <ChevronUp size={22} />
                                                    ) : (
                                                        <ChevronDown size={22} />
                                                    )}
                                                </button>
                                            </td>
                                        )}
                                    </tr>

                                    {expandable &&
                                        expandedRow === item.id &&
                                        renderExpandedRow && (
                                            <tr className="border-b border-gray-200 bg-gray-50">
                                                <td
                                                    colSpan={
                                                        expandable
                                                            ? columns.length + 1
                                                            : columns.length
                                                    }
                                                    className="p-5"
                                                >
                                                    {renderExpandedRow(item)}
                                                </td>
                                            </tr>
                                        )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={
                                        expandable
                                            ? columns.length + 1
                                            : columns.length
                                    }
                                    className="px-4 py-10 text-center text-sm text-gray-500"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {!isLoading && totalRows > 0 && (
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-200 px-5 py-2">
                    <p className="text-xs text-gray-600">
                        <span className="font-semibold">
                            {(page - 1) * limit + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold">
                            {Math.min(page * limit, totalRows)}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold">
                            {totalRows}
                        </span>{" "}
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => onPageChange?.(page - 1)}
                            className="cursor-pointer flex items-center gap-1 rounded-lg border border-gray-300 p-1 text-xs disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <button className="px-2 text-xs font-semibold">
                            {page}
                        </button>

                        <button
                            disabled={page >= totalPages}
                            onClick={() => onPageChange?.(page + 1)}
                            className="cursor-pointer flex items-center gap-1 rounded-lg border border-gray-300 p-1 text-xs disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommonTable;