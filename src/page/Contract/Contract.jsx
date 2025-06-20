import { DynamicHeader } from "@/components/component/Dynamic-Header";
import { DataTable } from "@/components/component/Dynamic-Table";
import { MainScletot } from "@/components/component/main-scletot";
import dayjs from "dayjs";
import React, { useState } from "react";
import DownloadIcon from "@/assets/imgs/download.png";
import { PriceFormater } from "@/components/component/Price-Formater";
import { getTradesQuery } from "@/quires/quires";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { deleteTrade } from "@/service/trade";
import { toast } from "sonner";
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
    const queryClient = useQueryClient();
    const { data, isLoading, isError } = useQuery({
        ...getTradesQuery(params),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (id) => deleteTrade(id),
        onSuccess: (res) => {
            queryClient.invalidateQueries(["trades"]);
            toast.success("Shartnoma o'chirildi");
        },
        onError: (err) => {
            toast.error("Shartnomani o'chirib bo'lmadi");
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
            header: `${params.is_company ? "Direktor" : "Ismi"} `,
        },
        {
            header: "totalPrice",
            cell: ({ row }) => {
                return (
                    <PriceFormater
                        price={
                            Number(row.original.total_price) +
                            Number(row.original.service_cost) +
                            Number(row.original.accessory_cost)
                        }
                    />
                );
            },
        },
        // {
        //     header: "service_price",
        //     cell: ({ row }) => {
        //         return <PriceFormater price={row.original.service_cost} />;
        //     },
        // },
        // {
        //     header: "accessory_price",
        //     cell: ({ row }) => {
        //         return <PriceFormater price={row.original.accessory_cost} />;
        //     },
        // },
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
            accessorKey: "actions",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-end gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <a
                                        target="_blank"
                                        href={row.original.contract}
                                        className="bg-green-100 py-2 px-3 rounded-[15px]"
                                    >
                                        <img
                                            src={DownloadIcon}
                                            width={20}
                                            alt="Download"
                                        />
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => mutate(row.original.id)}
                                    disabled={isPending}
                                    className="text-red-500"
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            meta: {
                align: "right",
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
                <div className="mt-4 flex gap-3">
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
                    <p>{!params.is_company ? "Jismoniy" : "Yuridik"}</p>
                </div>
                <DataTable
                    data={data?.data?.Data?.client_products || []}
                    columns={column}
                />
            </div>
        </div>
    );
}
