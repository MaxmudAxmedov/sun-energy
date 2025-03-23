import React, { useCallback, useState } from "react";
import { DynamicHeader } from "@/components/component/Dynamic-Header";
import { useGetData } from "@/hook/useApi";
import { MainScletot } from "@/components/component/main-scletot";
import { FetchingRrror } from "@/components/component/Fetching-Error";

import dayjs from "dayjs";
import { DynamicPagination } from "@/components/component/Dynamic-Pagination";
import { DataTable } from "@/components/component/Dynamic-Table";
import { useNavigate } from "react-router-dom";
import { EditIcon } from "@/assets/icons/edit-icon";
import { CustomDeleteDialog } from "@/components/component/Custom-Delete-Dialog";

export default function ProductCategory() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 6;

  const { data, isLoading, isError } = useGetData({
    endpoint: "/product-categories",
    enabled: true,
    params: {
      page,
      limit,
      search,
    },
    getQueryKey: "/product-category",
  });
  console.log(data);

  const handleSearch = useCallback((value) => {
    setSearch(value);
    setPage(1);
  }, []);

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
        console.log(row.original);
        return (
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                navigate(`/editProductCategory/${row.original.id}`)
              }
              className=" bg-green-100 py-2 px-3 rounded-[15px]"
            >
              <EditIcon />
            </button>
            <CustomDeleteDialog
              dynamicRowId={row.original.id}
              endpoint={`product-category`}
              mutateQueryKey={"product-category"}
            />
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return <MainScletot />;
  }

  if (isError) {
    return <FetchingRrror />;
  }

  return (
    <div>
      <DynamicHeader
        title="productCategory"
        btnName="createProductCategory"
        inputPlacholder="searchProductCategory"
        btnNavigate="/createProductCategory"
        onSearch={handleSearch}
      />

      <div className="mt-6">
        <DataTable data={data?.Data?.product_categories} columns={column} />
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
