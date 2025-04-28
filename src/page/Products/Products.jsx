import React, { useState } from "react";
import { FetchingError } from "@/components/component/FetchingError";
import { MainScletot } from "@/components/component/main-scletot";
import { DataTable } from "@/components/component/Dynamic-Table";
import dayjs from "dayjs";
import { CustomDeleteDialog } from "@/components/component/Custom-Delete-Dialog";
import { getProductsQuery } from "@/quires/quires";
import { useQuery } from "@tanstack/react-query";
import { DynamicHeader } from "@/components/component/Dynamic-Header";
import { useGetData } from "@/hook/useApi";
import { Spinner } from "@/components/component/spinner";

import OptionalImage from "@/assets/imgs/optional-img.jpg";
import ProductDrawer from "./ProductDrawer";

// const params = {
//     search: "",
//     limit: 20,
// };

export default function Products() {
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { data, isLoading, isError } = useQuery({
        ...getProductsQuery({ limit: 100, search: searchTerm }),
        staleTime: Infinity,
        cacheTime: 0,
    });
    console.log(data);

    const infoClick = (row) => () => {
        setSelectedRowData(row);
        setIsSheetOpen(true);
    };

    const handleCategory = (categoryId) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { data, isLoading, isError } = useGetData({
            endpoint: `/product-category/${categoryId}`,
            enabled: true,
            getQueryKey: "/product-category",
        });
        {
            isLoading && <Spinner />;
        }
        {
            isError && "error";
        }
        return data?.name;
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
                            src={row?.original?.photo || OptionalImage}
                            alt=""
                            className="w-[40px] h-[35px] rounded-md"
                        />
                    </div>
                );
            },
        },
        {
            accessorKey: "name",
            header: "fullName",
        },
        {
            header: "category",
            cell: ({ row }) => {
                return <div>{handleCategory(row.original.category_id)}</div>;
            },
        },
        {
            header: "price",
            cell: ({ row }) => {
                return <div>{row.original.price}</div>;
            },
        },
        {
            header: "count",
            cell: ({ row }) => {
                return <div>{row.original.count_of_product}</div>;
            },
        },
        {
            header: "createdAt",
            cell: ({ row }) => {
                return (
                    <div>
                        {dayjs(row.original.created_at).format("DD/MM/YYYY")}
                    </div>
                );
            },
        },
        {
            header: "updatedAt",
            cell: ({ row }) => {
                const updateDate = row?.original?.updated_at;
                return (
                    <div>
                        {updateDate
                            ? dayjs(row?.original?.updated_at).format(
                                  "DD/MM/YYYY"
                              )
                            : "-------------"}
                    </div>
                );
            },
        },
        {
            header: "actions",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-3">
                        <ProductDrawer
                            isSheetOpen={isSheetOpen}
                            setIsSheetOpen={setIsSheetOpen}
                            row={row}
                            selectedRowData={selectedRowData}
                            infoClick={infoClick}
                        />
                        <CustomDeleteDialog
                            dynamicRowId={row.original.id}
                            endpoint={`product`}
                            mutateQueryKey={"product-categories"}
                            deleteToastMessage={"productDeleted"}
                        />
                    </div>
                );
            },
        },
    ];

    // if (isLoading) {
    //     return <MainScletot />;
    // }

    // if (isError) {
    //     return <FetchingError />;
    // }

    return (
        <div>
            <DynamicHeader
                title="products"
                btnName="createProduct"
                inputPlacholder="searchProduct"
                btnNavigate="createProduct"
                onSearch={(value) => setSearchTerm(value)}
                isInput={true}
            />
            <div className="mt-6">
                <DataTable
                    data={data?.data?.Data?.products || []}
                    columns={column}
                />
            </div>
        </div>
    );
}
