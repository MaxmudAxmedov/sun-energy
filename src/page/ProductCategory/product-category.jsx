import React, { useCallback, useState } from "react";
import { DynamicHeader } from "@/components/component/Dynamic-Header";
import { useGetData } from "@/hook/useApi";
import { MainScletot } from "@/components/component/main-scletot";
import { FetchingError } from "@/components/component/FetchingError";

import dayjs from "dayjs";
import { DataTable } from "@/components/component/Dynamic-Table";
import { useNavigate } from "react-router-dom";
import { EditIcon } from "@/assets/icons/edit-icon";
import { CustomDeleteDialog } from "@/components/component/Custom-Delete-Dialog";

export default function ProductCategory() {
  const navigate = useNavigate();
  const limit = 1000;
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError } = useGetData({
    endpoint: "/product-categories",
    enabled: true,
    params: {
      limit,
      search: searchTerm,
    },
    getQueryKey: "/product-category",
  });

  {
    isLoading && <MainScletot />;
  }
  {
    isError && <FetchingError />;
  }

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
              deleteToastMessage={"productCategoryDeleted"}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <DynamicHeader
        title="productCategory"
        btnName="createProductCategory"
        inputPlacholder="searchProductCategory"
        btnNavigate="/createProductCategory"
        isInput={true}
        onSearch={(value) => setSearchTerm(value)}
      />

      <div className="mt-6">
        <DataTable
          data={data?.Data?.product_categories || []}
          columns={column}
        />
      </div>
    </div>
  );
}
