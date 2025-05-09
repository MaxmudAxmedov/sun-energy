import { DynamicHeader } from "@/components/component/Dynamic-Header";
import { DataTable } from "@/components/component/Dynamic-Table";
import { MainScletot } from "@/components/component/main-scletot";
import { useGetData } from "@/hook/useApi";
import dayjs from "dayjs";
import React, { useState } from "react";
import DownloadIcon from "@/assets/imgs/download.png";
import { DynamicPagination } from "@/components/component/Dynamic-Pagination";
import { DynamicDrawer } from "@/components/component/dynamic-drawer";
import { EyeIcon } from "@/assets/icons/eye-icon";
import { PriceFormater } from "@/components/component/Price-Formater";
import ContractTable from "./CreateContract/ContractTable";
export default function Contract() {
    const [page, setPage] = useState(1);
    //   const [search, setSearch] = useState("");
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const limit = 1000;
    const [searchTerm, setSearchTerm] = useState("");
    const { data, isLoading, isError } = useGetData({
        endpoint: "/trades",
        getQueryKey: "/trades",
        params: {
            limit,
            // search: searchTerm,
        },
    });

    const column = [
        {
            header: "No",
            cell: ({ row }) => {
                return <div>{row.index + 1}</div>;
            },
        },
        {
            accessorKey: "client_name",
            header: "fullName",
        },
        {
            header: "totalPrice",
            cell: ({ row }) => {
                return <PriceFormater price={row.original.total_price} />;
            },
        },
        {
            header: "lastPurchaseDate",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center">
                        {dayjs(row.original.created_at).format("DD/MM/YYYY")}
                        <div className="ml-2 text-gray-400">
                            {dayjs(row.original.created_at).format("HH:mm")}
                        </div>
                    </div>
                );
            },
        },
        {
            header: "actions",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-3">
                        <a
                            target="blank"
                            href={row.original.contract}
                            className="bg-green-100 py-2 px-3 rounded-[15px]"
                        >
                            <img src={DownloadIcon} width={20} alt="" />
                        </a>
                    </div>
                );
            },
        },
    ];

    {
        isLoading && <MainScletot />;
    }
    {
        isError && "error";
    }

    return (
        <div>
            <DynamicHeader
                title="contract"
                btnName="create"
                inputPlacholder="searchContract"
                btnNavigate="/createContract"
                // onSearch={(value) => setSearchTerm(value)}
                // isInput={true}
            />
            <div>
                <DataTable
                    data={data?.Data?.client_products || []}
                    columns={column}
                />
            </div>
        </div>
    );
}
