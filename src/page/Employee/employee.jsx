import React, { useCallback, useState } from "react";
import { DynamicHeader } from "@/components/component/Dynamic-Header";
import { useGetData } from "@/hook/useApi";
import { DataTable } from "@/components/component/Dynamic-Table";
import { EditIcon } from "@/assets/icons/edit-icon";
import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
import { DynamicPagination } from "@/components/component/Dynamic-Pagination";
import { MainScletot } from "@/components/component/main-scletot";
import dayjs from "dayjs";
import { FetchingRrror } from "@/components/component/Fetching-Error";
import { CustomDeleteDialog } from "@/components/component/Custom-Delete-Dialog";

export default function Employee() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

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
  console.log(data);

  const column = [
    {
      header: "No",
      cell: ({ row }) => {
        return <div>{row.index + 1}</div>;
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
      accessorKey: "position_name",
      header: "position",
    },
    {
      header: "createdAt",
      cell: ({ row }) => {
        console.log(row.original.created_at);
        return <div>{dayjs(row.original.created_at).format("DD/MM/YYYY")}</div>;
      },
    },
    {
      header: "updatedAt",
      cell: ({ row }) => {
        const updateDate = row?.original?.updated_at;
        return (
          <div>
            {updateDate
              ? dayjs(row?.original?.updated_at).format("DD/MM/YYYY")
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
            <button
              onClick={() => navigate(`/editEmployee/${row.original.id}`)}
              className=" bg-green-100 py-2 px-3 rounded-[15px]"
            >
              <EditIcon />
            </button>
            <CustomDeleteDialog
              dynamicRowId={row.original.id}
              endpoint={"employee"}
              mutateQueryKey={"employees"}
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
        <FetchingRrror />
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
