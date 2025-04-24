import { DeleteIcon } from "@/assets/icons/delete-icon";
import { EditIcon } from "@/assets/icons/edit-icon";
import { CustomDeleteDialog } from "@/components/component/Custom-Delete-Dialog";
import { DynamicHeader } from "@/components/component/Dynamic-Header";
// import { DynamicPagination } from "@/components/component/Dynamic-Pagination";
import { DataTable } from "@/components/component/Dynamic-Table";
import { MainScletot } from "@/components/component/main-scletot";
import { useGetData } from "@/hook/useApi";
import dayjs from "dayjs";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Position() {
    const navigate = useNavigate();
    // const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const limit = 1000;
    const { data, isLoading, isError } = useGetData({
        endpoint: "/positions",
        enabled: true,
        params: {
            // page,
            limit,
            search,
        },
        getQueryKey: "/positions",
    });
    console.log(data);

    const column = [
        {
            header: "No",
            cell: ({ row }) => {
                return <div>{row.index + 1}</div>;
            },
        },
        {
            accessorKey: "name",
            header: "fullName",
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
                console.log(row.original);
                return (
                    <div className="flex gap-3">
                        <button
                            onClick={() =>
                                navigate(`/editPosition/${row.original.id}`)
                            }
                            className=" bg-green-100 py-2 px-3 rounded-[15px]"
                        >
                            <EditIcon />
                        </button>
                        <CustomDeleteDialog
                            endpoint={`position`}
                            dynamicRowId={row.original.id}
                            mutateQueryKey={"positions"}
                        />
                    </div>
                );
            },
        },
    ];

    const handleSearch = useCallback((value) => {
        setSearch(value);
    }, []);

    if (isLoading)
        return (
            <div>
                <MainScletot />
            </div>
        );
    if (isError) return <div>Error fetching data</div>;

    return (
        <div>
            <DynamicHeader
                title="position"
                btnName="create"
                inputPlacholder="searchPosition"
                btnNavigate="/createPosition"
                onSearch={handleSearch}
            />

            <div className="mt-6">
                <DataTable data={data?.Data?.positions} columns={column} />
            </div>

            {/* <div className="mt-3">
        <DynamicPagination
          data={data}
          setPage={setPage}
          limit={limit}
          page={page}
        />
      </div> */}
        </div>
    );
}
