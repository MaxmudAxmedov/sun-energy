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

  // Fetch all categories once in the main component
  const { data: categoriesData, isLoading: isCategoriesLoading, isError: isCategoriesError } = useGetData({
    endpoint: `/product-categories`,
    enabled: true,
    getQueryKey: "/product-categories",
  });

  const handleCategory = (categoryId) => {
    if (isCategoriesLoading) return <Spinner />;
    if (isCategoriesError) return "error";
    const category = categoriesData?.Data?.product_categories?.find((cat) => cat.id === categoryId);
    return category?.name || "";
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
          <div className="relative">
            <img
              src={forceConvertDomain(row?.original?.photo) || OptionalImage}
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
        return <div>{dayjs(row.original.created_at).format("DD/MM/YYYY")}</div>;
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
      <div className="mt-6">
        <DataTable data={data?.data?.Data?.products || []} columns={column} />
      </div>
    </div>
  );
}
