import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";

import React from "react";
import { cn } from "@/lib/utils";

export function DataTable({ columns, data = [] }) {
    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    const { t } = useTranslation();

    return (
        <div className="w-full">
            <div className="mx-auto mt-6 max-w-full h-[85vh] overflow-x-hidden rounded-md bg-white dark:bg-darkSecondary p-4 dark:bg-darkMain">
                <Table>
                    <TableHeader>
                        {table?.getHeaderGroups()?.map((headerGroup) => (
                            <TableRow
                                className="bg-mauiMist dark:bg-darkMainSecond"
                                key={headerGroup?.id}
                            >
                                {headerGroup?.headers?.map((header) => {
                                    return (
                                        <TableHead
                                            key={header?.id}
                                            className={cn(
                                                "font-bold text-hormagauntPurple dark:text-white",
                                                header.column.columnDef.meta
                                                    ?.align === "right" &&
                                                    "text-right"
                                            )}
                                        >
                                            {header?.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      t(
                                                          header?.column
                                                              ?.columnDef
                                                              ?.header
                                                      ),
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table?.getRowModel()?.rows?.length ? (
                            table?.getRowModel()?.rows?.map((row) => (
                                <TableRow
                                    className="hover:dark:bg-gray-900 transition-all duration-200"
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row?.getVisibleCells()?.map((cell) => (
                                        <TableCell
                                            className="py-3"
                                            key={cell.id}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns?.length}
                                    className="h-24 text-center"
                                >
                                    {t("noData")}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
