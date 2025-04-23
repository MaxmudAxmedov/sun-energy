import React, { useCallback, useState } from "react";
import { DynamicHeader } from "@/components/component/Dynamic-Header";
import { DynamicPagination } from "@/components/component/Dynamic-Pagination";
import { DataTable } from "@/components/component/Dynamic-Table";
import { FetchingError } from "@/components/component/FetchingError";
import { MainScletot } from "@/components/component/main-scletot";
import { useGetData } from "@/hook/useApi";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { EditIcon } from "@/assets/icons/edit-icon";
import { CustomDeleteDialog } from "@/components/component/Custom-Delete-Dialog";

import OptionImg from "@/assets/imgs/optional-img.jpg";
import { DynamicDrawer } from "@/components/component/dynamic-drawer";
import { EyeIcon } from "@/assets/icons/eye-icon";
import { Button } from "@/components/ui/button";
import { CustomDrawer } from "@/components/component/CustomDrawer";
import OptionalImg from "@/assets/imgs/optional-img.jpg";
import ClientDrawer from "./ClientDrawer";

export default function Clients() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const limit = 6;
    const { data, isLoading, isError } = useGetData({
        endpoint: "/clients",
        enabled: true,
        params: { page, limit, search },
        getQueryKey: "/clients",
    });

    const infoClick = (row) => () => {
        setSelectedRowData(row);
        setIsSheetOpen(true);
    };
    console.log(selectedRowData);
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
                            src={row?.original?.file || OptionImg}
                            alt=""
                            className="w-[40px] h-[35px] rounded-md object-cover"
                        />
                    </div>
                );
            },
        },
        {
            accessorKey: "full_name",
            header: "fullName",
        },
        {
            accessorKey: "phone",
            header: "phoneNumber",
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
                // console.log(row.original.id);
                return (
                    <div className="flex gap-3">
                        <ClientDrawer
                            isSheetOpen={isSheetOpen}
                            setIsSheetOpen={setIsSheetOpen}
                            row={row}
                            selectedRowData={selectedRowData}
                            infoClick={infoClick}
                        />

                        {/* <button
                            onClick={() =>
                                navigate(`/editClient/${row.original.id}`)
                            }
                            className=" bg-green-100 py-2 px-3 rounded-[15px]"
                        >
                            <EditIcon />
                        </button> */}
                        <CustomDeleteDialog
                            endpoint={`client`}
                            dynamicRowId={row.original.id}
                            mutateQueryKey={"clients"}
                            deleteToastMessage={"clientDeleted"}
                        />
                    </div>
                );
            },
        },
    ];

    const handleSearch = useCallback((value) => {
        setSearch(value);
        setPage(1);
    }, []);

    if (isLoading)
        return (
            <div>
                <MainScletot />
            </div>
        );

    if (isError)
        return (
            <div>
                <FetchingError />
            </div>
        );

    return (
        <div>
            <DynamicHeader
                title="clients"
                btnName="create"
                inputPlacholder="searchClient"
                btnNavigate="/createClient"
                onSearch={handleSearch}
            />

            <div className="mt-6">
                <DataTable data={data?.Data?.clients} columns={column} />
            </div>

            <div className="mt-3">
                <DynamicPagination
                    data={data}
                    setPage={setPage}
                    limit={limit}
                    page={page}
                />
            </div>
        </div>
    );
}
