import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useLocation } from "react-router-dom";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";

import React, { useState } from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

import dayjs from "dayjs";

import { Button } from "../ui/button";


export function DataTable({ columns, data = [] }) {
    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    console.log(columns);
    const { t } = useTranslation();
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { pathname } = useLocation();

    const handleCliendInfosDrawer = (data) => {
        setSelectedRowData(data);
        setIsSheetOpen(true);
    };

  console.log(selectedRowData);
  return (
    <div className="w-full">
      <div className="mx-auto mt-6 max-w-full h-[78vh] overflow-x-hidden  rounded-md bg-white dark:bg-darkSecondary p-4 dark:bg-darkMain">
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
                      className="font-bold text-hormagauntPurple dark:text-white"
                      key={header?.id}
                    >
                      {header?.isPlaceholder
                        ? null
                        : flexRender(
                            t(header?.column?.columnDef?.header),
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
                  onClick={() => handleCliendInfosDrawer(row.original)}
                  className="cursor-pointer"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row?.getVisibleCells()?.map((cell) => (
                    <TableCell className="py-3" key={cell.id}>
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
        {pathname === "/clients" && (
          <Drawer
            direction="right"
            open={isSheetOpen}
            onOpenChange={setIsSheetOpen}
          >
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="flex flex-col gap-y-5">
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("fullName")}:{" "}
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.full_name}
                    </p>
                  </span>
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("phoneNumber")}:
                    <p className="dark:text-white text-indigo-700">
                      +{selectedRowData?.phone}
                    </p>
                  </span>
                  {selectedRowData?.company_name && (
                    <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                      {t("companyName")}:
                      <p className="dark:text-white text-indigo-700">
                        {selectedRowData?.company_name}
                      </p>
                    </span>
                  )}
                  {selectedRowData?.inn_number !== 0 && (
                    <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                      {t("companyName")}:
                      <p className="dark:text-white text-indigo-700">
                        {selectedRowData?.inn_number}
                      </p>
                    </span>
                  )}
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("region")}:
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.region}
                    </p>
                  </span>
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("district")}:
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.district}
                    </p>
                  </span>
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("street")}:
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.street}
                    </p>
                  </span>
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("balance")}:
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.balance}
                    </p>
                  </span>
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("createdAt")}:
                    <p className="dark:text-white text-indigo-700">
                      {dayjs(selectedRowData?.created_at).format(
                        "DD.MM.YYYY HH:mm"
                      )}
                    </p>
                  </span>
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("passportSeries")}:
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.passport_series}
                    </p>
                  </span>
                </DrawerTitle>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  );
    console.log(selectedRowData);

    return (
        <div className="w-full">
            <div className="mx-auto mt-6 max-w-full h-[78vh] overflow-x-hidden  rounded-md bg-white dark:bg-darkSecondary p-4 dark:bg-darkMain">
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
                                            className="font-bold text-hormagauntPurple dark:text-white"
                                            key={header?.id}
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
                                    onClick={() =>
                                        handleCliendInfosDrawer(row.original)
                                    }
                                    className="cursor-pointer"
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
                {(pathname === "/employee" ||
                    pathname === "/" ||
                    pathname === "/clients" ||
                    pathname === "/contract") && (
                    <Drawer open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <DrawerContent className="flex flex-col pt-2">
                            <DrawerHeader
                                className={
                                    "flex justify-between items-center px-6 border-b"
                                }
                            >
                                <DrawerTitle className="flex flex-col">
                                    Details
                                </DrawerTitle>
                                <DrawerClose asChild>
                                    <Button variant="outline">X</Button>
                                </DrawerClose>
                            </DrawerHeader>

                            <div className="flex-1 overflow-auto p-6 space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        {t("fullName")}
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {selectedRowData?.full_name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        {t("companyName")}:
                                    </p>

                                    {selectedRowData?.company_name ? (
                                        <p className="font-medium text-gray-900">
                                            {selectedRowData?.company_name}
                                        </p>
                                    ) : (
                                        <p className=" font-medium text-gray-900">
                                            {t("companyDoesNotExist")}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        {t("phoneNumber")}
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        +{selectedRowData?.phone}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        {t("region")}
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {selectedRowData?.region}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        {t("district")}
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {selectedRowData?.district}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        {t("street")}
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {selectedRowData?.street}
                                    </p>
                                </div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                )}
            </div>
        </div>
    );
}
