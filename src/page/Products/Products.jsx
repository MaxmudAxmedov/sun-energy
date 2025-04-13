import React, { useState } from "react";
import { FetchingError } from "@/components/component/FetchingError";
import { MainScletot } from "@/components/component/main-scletot";
// import { DynamicPagination } from "@/components/component/Dynamic-Pagination";
import { DataTable } from "@/components/component/Dynamic-Table";
import dayjs from "dayjs";
import { EditIcon } from "@/assets/icons/edit-icon";
import { CustomDeleteDialog } from "@/components/component/Custom-Delete-Dialog";
import { getProductsQuery } from "@/quires/quires";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { DynamicHeader } from "@/components/component/Dynamic-Header";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import { useGetData } from "@/hook/useApi";
import { Spinner } from "@/components/component/spinner";
import { DynamicPagination } from "@/components/component/Dynamic-Pagination";

const params = {
    search: "",
    limit: "500",
    page: "1",
};

export default function Products() {
    const [page, setPage] = useState(params.page);
    const [search, setSearch] = useState("");
    const navigate = useNavigate("");
    const [debouncedSearch] = useDebounce(search, 500);
    const [initialParams, setInitialParams] = useState({
        ...params,
        search: debouncedSearch,
    });

    // useEffect(() => {
    //     setInitialParams((prev) => ({
    //         ...prev,
    //         search: debouncedSearch,
    //         page: "1",
    //     }));
    // }, [debouncedSearch]);

    const { data, isLoading, isError } = useQuery({
        ...getProductsQuery(initialParams),
        staleTime: Infinity,
        cacheTime: 0,
    });

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

    const handleSearch = (value) => {
        setSearch(value);
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
                            src={row?.original?.photo}
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
            header: "precent",
            cell: ({ row }) => {
                return <div>{row.original.percent} %</div>;
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
                        <button
                            onClick={() =>
                                navigate(`/editProduct/${row.original.id}`)
                            }
                            className="bg-green-100 py-2 px-3 rounded-[15px]"
                        >
                            <EditIcon />
                        </button>
                        <CustomDeleteDialog
                            dynamicRowId={row.original.id}
                            endpoint={`product`}
                            mutateQueryKey={"product-categories"}
                        />
                        {/* <div className="hover:scale-110 cursor-pointer transition-all duration-200 w-[28px] h-[28px] flex items-center justify-center rounded-md">
                            <Download />
                        </div> */}
                    </div>
                );
            },
        },
    ];

    if (isLoading) {
        return <MainScletot />;
    }

    if (isError) {
        return <FetchingError />;
    }

    return (
        <div>
            <DynamicHeader
                title="products"
                btnName="createProduct"
                inputPlacholder="searchProduct"
                btnNavigate="createProduct"
                onSearch={handleSearch}
            />
            <div className="mt-6">
                <DataTable data={data?.data?.Data?.products} columns={column} />
            </div>
            <div className="mt-3">
                <DynamicPagination
                    data={data}
                    setPage={setPage}
                    limit={initialParams.limit}
                    page={page}
                />
            </div>
        </div>
    );
}
