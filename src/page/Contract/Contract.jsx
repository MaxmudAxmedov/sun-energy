import { DynamicHeader } from "@/components/component/Dynamic-Header";
import { DataTable } from "@/components/component/Dynamic-Table";
import { MainScletot } from "@/components/component/main-scletot";
import dayjs from "dayjs";
import React, { useState } from "react";
import DownloadIcon from "@/assets/imgs/download.png";
import { PriceFormater } from "@/components/component/Price-Formater";
import { getTradesQuery } from "@/quires/quires";
import { useQuery } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
const initialParams = {
    client_id: "",
    employee_id: "",
    from_date: "",
    to_date: "",
    is_company: false,
    page: "1",
    limit: "10",
};
export default function Contract() {
    //   const [search, setSearch] = useState("");
    const [params, setParams] = useState(initialParams);

    const { data, isLoading, isError } = useQuery({
        ...getTradesQuery(params),
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
            header: `${params.is_company ? "Direktor" : "Ismi"} `,
        },
        {
            header: "totalPrice",
            cell: ({ row }) => {
                return <PriceFormater price={row.original.total_price} />;
            },
        },
        {
            header: "service_price",
            cell: ({ row }) => {
                return <PriceFormater price={row.original.service_cost} />;
            },
        },
        {
            header: "accessory_price",
            cell: ({ row }) => {
                return <PriceFormater price={row.original.accessory_cost} />;
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
                <div className="mt-4">
                    <Switch
                        checked={params.is_company}
                        onCheckedChange={(value) =>
                            setParams((prev) => ({
                                ...prev,
                                is_company: value,
                            }))
                        }
                        id="airplane-mode"
                    />
                </div>
                <DataTable
                    data={data?.data?.Data?.client_products || []}
                    columns={column}
                />
            </div>
        </div>
    );
}
