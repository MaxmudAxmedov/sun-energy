import { DynamicHeader } from "@/components/component/Dynamic-Header";
import { DataTable } from "@/components/component/Dynamic-Table";
import { MainScletot } from "@/components/component/main-scletot";
import { useGetData } from "@/hook/useApi";
import dayjs from "dayjs";
import React from "react";

export default function Contract() {
    const { data, isLoading, isError } = useGetData({
        endpoint: "/trades",
        getQueryKey: "/trades",
        params: {},
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
            accessorKey: "product_name",
            header: "productName",
        },
        {
            header: "totalPrice",
            cell: ({ row }) => {
                const totalPrice = row.original.total_price;
                const formattedPrice = new Intl.NumberFormat("uz-UZ").format(
                    totalPrice
                );
                return <div>{formattedPrice}</div>;
            },
        },
        {
            header: "totalCount",
            cell: ({ row }) => {
                return <div>{row.original.total_count_of_product}</div>;
            },
        },
        {
            header: "lastPurchaseDate",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center">
                        {dayjs(row.original.last_purchase_date).format(
                            "DD/MM/YYYY"
                        )}
                        <div className="ml-2 text-gray-400">
                            {dayjs(row.original.last_purchase_date).format(
                                "HH:mm"
                            )}
                        </div>
                    </div>
                );
            },
        },
        // {
        //     header: "actions",
        //     cell: ({ row }) => {
        //         return (
        //             <div className="flex items-center gap-3">
        //                 <button
        //                     disabled={true}
        //                     onClick={() =>
        //                         navigate(`/editProduct/${row.original.id}`)
        //                     }
        //                     className="bg-green-100 py-2 px-3 rounded-[15px]"
        //                 >
        //                     <EditIcon />
        //                 </button>
        //             </div>
        //         );
        //     },
        // },
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
            />
            <div>
                <DataTable data={data?.Data?.purchased} columns={column} />
            </div>
        </div>
    );
}
