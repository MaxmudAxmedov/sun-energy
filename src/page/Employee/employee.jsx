import React, { useState } from "react";
import { DynamicHeader } from "@/components/component/Dynamic-Header";
import { useGetData } from "@/hook/useApi";
import { DataTable } from "@/components/component/Dynamic-Table";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { DynamicPagination } from "@/components/component/Dynamic-Pagination";
import dayjs from "dayjs";

import OptionalImage from "@/assets/imgs/optional-img.jpg";
import EmployeDrawer from "./EmployeDrawer";
import { NumberFormatter } from "@/components/component/Number-Formatter";
import { forceConvertDomain } from "@/lib/forceConvertDomain";

export default function Employee() {
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const limit = 1000;
    const { data } = useGetData({
        endpoint: "/employees",
        enabled: true,
        params: {
            limit,
            search: searchTerm,
        },
        getQueryKey: "/employees",
    });
    const infoClick = (row) => () => {
        setSelectedRowData(row);
        setIsSheetOpen(true);
    };

    const column = [
        {
            header: "No",
            cell: ({ row }) => {
                return <div>{row.index + 1}</div>;
            },
        },
        {
            header: "image",
            cell: ({ row }) => {
                return (
                    <div>
                        <img
                            src={
                                forceConvertDomain(row?.original?.photo) ||
                                OptionalImage
                            }
                            alt=""
                            className="w-[80px] h-[55px] rounded-md"
                        />
                    </div>
                );
            },
        },
        {
            accessorKey: "first_name",
            header: "name",
        },
        {
            accessorKey: "last_name",
            header: "lastName",
        },
        {
            accessorKey: "district",
            header: "district",
        },
        {
            accessorKey: "quarter",
            header: "quarter",
        },
        {
            header: "phoneNumber",
            cell: ({ row }) => {
                return (
                    <div>
                        <NumberFormatter phone={row.original.phone} />
                    </div>
                );
            },
        },
        {
            accessorKey: "position_name",
            header: "position",
        },
        {
            header: "createdAt",
            cell: ({ row }) => {
                console.log(row.original.created_at);
                return (
                    <div>
                        {dayjs(row.original.created_at).format("DD/MM/YYYY")}
                    </div>
                );
            },
        },

        {
            header: "actions",
            cell: ({ row }) => {
                return (
                    <div className="flex gap-3">
                        <EmployeDrawer
                            isSheetOpen={isSheetOpen}
                            setIsSheetOpen={setIsSheetOpen}
                            row={row}
                            selectedRowData={selectedRowData}
                            infoClick={infoClick}
                        />
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <DynamicHeader
                title="employee"
                btnName="createEmployee"
                inputPlacholder="searchEmployee"
                btnNavigate="/createEmployee"
                onSearch={(value) => setSearchTerm(value)}
                isInput={true}
            />
            <div className="mt-6">
                <DataTable
                    data={data?.Data?.employees || []}
                    columns={column}
                />
            </div>
        </div>
    );
}
