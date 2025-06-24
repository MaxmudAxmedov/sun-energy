import React, { useEffect, useState } from "react";
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
import { PriceFormater } from "@/components/component/Price-Formater";
import { forceConvertDomain } from "@/lib/forceConvertDomain";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Products() {
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("site");
    const [activeData, setActiveData] = useState([]);
    const { data, isLoading, isError } = useQuery({
        ...getProductsQuery({ limit: 100, search: searchTerm }),
        staleTime: Infinity,
        cacheTime: 0,
    });

    {
        isLoading && <MainScletot />;
    }
    {
        isError && <FetchingError />;
    }

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

    useEffect(() => {
        if (activeTab == "site") {
            let res = data?.data?.Data?.products.filter(
                (i) => i.show_on_landing == true
            );
            setActiveData(res);
        } else {
            let res = data?.data?.Data?.products.filter(
                (i) => i.show_on_landing == false
            );
            setActiveData(res);
        }
    }, [activeTab, data]);

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
                    <div className="relative">
                        <img
                            src={
                                forceConvertDomain(row?.original?.photo) ||
                                OptionalImage
                            }
                            alt=""
                            className="w-[80px] h-[55px] rounded-md"
                        />
                        {row.original.watt !== 0 && (
                            <span className="absolute -top-2.5 -left-3 bg-primaryColor text-white text-[10px] py-[2px] px-1.5 rounded-md">
                                {row.original.watt} W
                            </span>
                        )}
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
                return <PriceFormater price={row.original.price} />;
            },
        },
        {
            header: "sellingPrice",
            cell: ({ row }) => {
                return <PriceFormater price={row.original.selling_price} />;
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
                            mutateQueryKey={"product"}
                            deleteToastMessage={"productDeleted"}
                        />
                    </div>
                );
            },
        },
    ];

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
            {/* <div className="mt-6">
                <DataTable
                    data={data?.data?.Data?.products || []}
                    columns={column}
                />
            </div> */}

            <Tabs
                defaultValue="site"
                value={activeTab}
                onValueChange={(val) => setActiveTab(val)}
                className="w-full mt-6"
            >
                <TabsList>
                    <TabsTrigger value="site">Web site</TabsTrigger>
                    <TabsTrigger value="admin">Admin panel</TabsTrigger>
                </TabsList>
                <TabsContent value="site">
                    <DataTable data={activeData || []} columns={column} />
                </TabsContent>

                <TabsContent value="admin">
                    <DataTable data={activeData || []} columns={column} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
