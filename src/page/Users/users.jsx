import { DynamicHeader } from "@/components/component/Dynamic-Header";
import { DataTable } from "@/components/component/Dynamic-Table";
import React, { useState } from "react";
import { useGetData } from "@/hook/useApi";
import { MainScletot } from "@/components/component/main-scletot";
import { FetchingError } from "@/components/component/FetchingError";
import dayjs from "dayjs";
import { EditIcon } from "@/assets/icons/edit-icon";
import { useNavigate } from "react-router-dom";
import { CustomDeleteDialog } from "@/components/component/Custom-Delete-Dialog";
import { DynamicPagination } from "@/components/component/Dynamic-Pagination";
import { DynamicDrawer } from "@/components/component/dynamic-drawer";
import { EyeIcon } from "@/assets/icons/eye-icon";
export default function Users() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  // const [selectedRowData, setSelectedRowData] = useState(null);
  // const [isSheetOpen, setIsSheetOpen] = useState(false);
  const limit = 1000;
  const { data, isLoading, isError } = useGetData({
    endpoint: "/users",
    params: {
      limit,
    },
    enabled: true,
    getQueryKey: "/users",
  });

  // const infoClick = (row) => () => {
  //   setSelectedRowData(row);
  //   setIsSheetOpen(true);
  // };

  if (isLoading) return <MainScletot />;
  if (isError) return <FetchingError />;

  const column = [
    {
      header: "No",
      cell: ({ row }) => {
        return <div>{row.index + 1}</div>;
      },
    },
    {
      accessorKey: "login",
      header: "name",
    },
    {
      accessorKey: "percent_for_employee",
      header: "percent",
    },

    {
      header: "createdAt",
      cell: ({ row }) => {
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
        return (
          <div className="flex items-center gap-3">
            {/* <button
              onClick={infoClick(row.original)}
              className=" bg-green-600 py-2 px-3 rounded-[15px]"
            >
              <EyeIcon />
            </button>
            <DynamicDrawer
              selectedRowData={selectedRowData}
              isSheetOpen={isSheetOpen}
              setIsSheetOpen={setIsSheetOpen}
            /> */}
            <button
              onClick={() => navigate(`/createUsers/${row.original.id}`)}
              className=" bg-green-100 py-2 px-3 rounded-[15px]"
            >
              <EditIcon />
            </button>
            <CustomDeleteDialog
              dynamicRowId={row.original.id}
              endpoint={`user`}
              mutateQueryKey={"users"}
              deleteToastMessage={"userDeleted"}
            />
          </div>
        );
      },
    },
  ];
  return (
    <div className="h-screen">
      <DynamicHeader
        title={"users"}
        btnNavigate={"/createUsers/new"}
        btnName="createUsers"
      />

      <div className="mt-6">
        <DataTable data={data?.Data?.users} columns={column} />
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
