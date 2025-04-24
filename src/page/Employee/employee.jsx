import React, { useCallback, useState } from "react";
import { DynamicHeader } from "@/components/component/Dynamic-Header";
import { useGetData } from "@/hook/useApi";
import { DataTable } from "@/components/component/Dynamic-Table";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
import { DynamicPagination } from "@/components/component/Dynamic-Pagination";
import { MainScletot } from "@/components/component/main-scletot";
import dayjs from "dayjs";
import { FetchingError } from "@/components/component/FetchingError";
import { CustomDeleteDialog } from "@/components/component/Custom-Delete-Dialog";

import OptionalImage from "@/assets/imgs/optional-img.jpg";
import EmployeDrawer from "./EmployeDrawer";

export default function Employee() {
    // const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const limit = 6;
    const { data, isLoading, isError } = useGetData({
        endpoint: "/employees",
        enabled: true,
        params: {
            page,
            limit,
            search,
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
                            src={row?.original?.photo || OptionalImage}
                            alt=""
                            className="w-[40px] h-[35px] rounded-md"
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
        // {
        //   header: "name",
        //   cell: ({ row }) => {
        //     return <div>{row?.original?.full_name}</div>;
        //   },
        // },

        {
            accessorKey: "phone",
            header: "phoneNumber",
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
                        {/* <button
                            onClick={infoClick(row.original)}
                            className=" bg-green-600 py-2 px-3 rounded-[15px]"
                        >
                            <EyeIcon />
                        </button> */}
                        {/* <DynamicDrawer
              selectedRowData={selectedRowData}
              isSheetOpen={isSheetOpen}
              setIsSheetOpen={setIsSheetOpen}
            /> */}
                        <EmployeDrawer
                            isSheetOpen={isSheetOpen}
                            setIsSheetOpen={setIsSheetOpen}
                            row={row}
                            selectedRowData={selectedRowData}
                            infoClick={infoClick}
                        />
                        <CustomDeleteDialog
                            dynamicRowId={row.original.id}
                            endpoint={"employee"}
                            mutateQueryKey={"employees"}
                            deleteToastMessage={"employeeDeleted"}
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
                title="employee"
                btnName="createEmployee"
                inputPlacholder="searchEmployee"
                btnNavigate="/createEmployee"
                onSearch={handleSearch}
            />
            <div className="mt-6">
                <DataTable data={data?.Data?.employees} columns={column} />
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
