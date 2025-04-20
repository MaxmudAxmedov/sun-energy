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
import { number } from "zod";

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

  const handleCliendInfosDrawer = (data) => {
    setSelectedRowData(data);
    setIsSheetOpen(true);
  };

  console.log(selectedRowData);

  const formatPrice = new Intl.NumberFormat("uz-UZ").format(
    selectedRowData?.price
  );
  const formatTotalPrice = new Intl.NumberFormat("uz-UZ").format(
    selectedRowData?.total_price
  );
  const formatServiceCost = new Intl.NumberFormat("uz-UZ").format(
    selectedRowData?.service_cost
  );
  const formatAccessoryCost = new Intl.NumberFormat("uz-UZ").format(
    selectedRowData?.accessory_cost
  );

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
                  className="cursor-pointer hover:dark:bg-gray-700 transition-all duration-200"
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
        <Drawer
          direction="right"
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
        >
          <DrawerContent className="overflow-y-scroll overflow-x-hidden">
            <DrawerHeader>
              <h1 className="tablet:text-[28px] tablet:pb-2">{t("infos")} :</h1>
              <DrawerTitle className="flex flex-col gap-y-5 tablet:pb-4">
                {/* Full Name */}
                {selectedRowData?.full_name && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("fullName")}:{" "}
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.full_name}
                    </p>
                  </span>
                )}
                {/* Name */}
                {selectedRowData?.name && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("name")}:{" "}
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.name}
                    </p>
                  </span>
                )}
                {/* First Name */}
                {selectedRowData?.first_name && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("firstName")}:{" "}
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.first_name}
                    </p>
                  </span>
                )}
                {/* Last Name */}
                {selectedRowData?.last_name && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("secondName")}:{" "}
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.last_name}
                    </p>
                  </span>
                )}
                {/* patronymic */}
                {selectedRowData?.patronymic && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("lastName")}:{" "}
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.patronymic}
                    </p>
                  </span>
                )}
                {/* description */}
                {selectedRowData?.description && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("description")}:
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.description}
                    </p>
                  </span>
                )}
                {/* Phone */}
                {selectedRowData?.phone && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("phoneNumber")}:
                    <p className="dark:text-white text-indigo-700">
                      +{selectedRowData?.phone}
                    </p>
                  </span>
                )}
                {/* company_name */}
                {selectedRowData?.company_name && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("companyName")}:
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.company_name}
                    </p>
                  </span>
                )}
                {/* inn_number */}
                {selectedRowData?.inn_number === Number() && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("innNumber")}:
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.inn_number}
                    </p>
                  </span>
                )}
                {/* Region */}
                {selectedRowData?.region && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("region")}:
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.region}
                    </p>
                  </span>
                )}
                {/* Discrit */}
                {selectedRowData?.district && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("district")}:
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.district}
                    </p>
                  </span>
                )}
                {/* Street */}
                {selectedRowData?.street && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("street")}:
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.street}
                    </p>
                  </span>
                )}
                {/* Balance */}
                {selectedRowData?.balance === Number() && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("balance")}:
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.balance}
                    </p>
                  </span>
                )}
                {/* Passport_seria */}
                {selectedRowData?.passport_series && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("passportSeries")}:
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.passport_series}
                    </p>
                  </span>
                )}
                {/* Position  */}
                {selectedRowData?.position_name && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("position")}:
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.position_name}
                    </p>
                  </span>
                )}
                {/* Cashback  */}
                {selectedRowData?.cashback === Number() && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("cashback")}:
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.cashback}
                    </p>
                  </span>
                )}
                {/* count_of_clients  */}
                {selectedRowData?.count_of_clients && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("countOfClients")}:
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.count_of_clients}
                    </p>
                  </span>
                )}
                {/* Price */}
                {selectedRowData?.price && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("price")}:
                    <p className="dark:text-white text-indigo-700">
                      {formatPrice}
                    </p>
                  </span>
                )}
                {/* count_of_product */}
                {selectedRowData?.count_of_product && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("countOfProduct")}:
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.count_of_product}
                    </p>
                  </span>
                )}
                {/* client_name */}
                {selectedRowData?.client_name && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("clientName")}:
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.client_name}
                    </p>
                  </span>
                )}
                {/* Products */}
                {selectedRowData?.items && (
                  <span className="flex items-center gap-x-3 text-indigo-900 dark:text-indigo-300">
                    {t("products")}:
                    <p className="dark:text-white text-indigo-700">
                      {selectedRowData?.items?.length}
                    </p>
                  </span>
                )}
                {/* accessory_cost */}
                {selectedRowData?.accessory_cost && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("accessoryCost")}:
                    <p className="dark:text-white text-indigo-700">
                      {formatAccessoryCost}
                    </p>
                  </span>
                )}
                {/* service_cost */}
                {selectedRowData?.service_cost && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("serviceCost")}:
                    <p className="dark:text-white text-indigo-700">
                      {formatServiceCost}
                    </p>
                  </span>
                )}
                {/* total_price */}
                {selectedRowData?.total_price && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("totalPrice")}:
                    <p className="dark:text-white text-indigo-700">
                      {formatTotalPrice}
                    </p>
                  </span>
                )}
                {/* Photo */}
                {selectedRowData?.photo && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("photo")}:
                    <img
                      src={selectedRowData.photo}
                      className="max-w-[300px] rounded-lg w-full h-full max-h-[160px]"
                      alt=""
                    />
                  </span>
                )}
                {/* Created_at */}
                {selectedRowData?.created_at && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("createdAt")}:
                    <p className="dark:text-white text-indigo-700">
                      {dayjs(selectedRowData?.created_at).format(
                        "DD.MM.YYYY HH:mm"
                      )}
                    </p>
                  </span>
                )}
                {/* Update_at */}
                {selectedRowData?.updated_at && (
                  <span className="flex gap-x-2 text-indigo-900 dark:text-indigo-300">
                    {t("updateAt")}:
                    <p className="dark:text-white text-indigo-700">
                      {dayjs(selectedRowData?.updated_at).format(
                        "DD.MM.YYYY HH:mm"
                      )}
                    </p>
                  </span>
                )}
              </DrawerTitle>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
