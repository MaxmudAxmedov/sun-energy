import React, { useState } from "react";
import { DynamicHeader } from "@/components/component/Dynamic-Header";
import { DataTable } from "@/components/component/Dynamic-Table";
import { useGetData } from "@/hook/useApi";
import dayjs from "dayjs";

import OptionImg from "@/assets/imgs/optional-img.jpg";

import ClientDrawer from "./ClientDrawer";
import { NumberFormatter } from "@/components/component/Number-Formatter";

export default function Clients() {
  // const [page, setPage] = useState(1);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const limit = 1000;
  const [searchTerm, setSearchTerm] = useState("");
  const { data } = useGetData({
    endpoint: "/clients",
    enabled: true,
    params: { limit, search: searchTerm },
    getQueryKey: "/clients",
  });

  console.log(data?.Data?.clients);

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
              src={row?.original?.file || OptionImg}
              alt=""
              className="w-[80px] h-[55px] rounded-md object-cover"
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
      header: "phoneNumber",
      cell: ({ row }) => {
        return <NumberFormatter phone={row.original.phone} />;
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
          </div>
        );
      },
    },
  ];

  // if (isLoading)
  //     return (
  //         <div>
  //             <MainScletot />
  //         </div>
  //     );

  // if (isError)
  //     return (
  //         <div>
  //             <FetchingError />
  //         </div>
  //     );

  return (
    <div>
      <DynamicHeader
        title="clients"
        btnName="create"
        inputPlacholder="searchClient"
        btnNavigate="/createClient"
        onSearch={(value) => setSearchTerm(value)}
        isInput={true}
      />

      <div className="mt-6">
        <DataTable data={data?.Data?.clients || []} columns={column} />
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
