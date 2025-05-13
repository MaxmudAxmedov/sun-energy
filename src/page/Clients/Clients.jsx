import React, { useState } from "react";
import { DynamicHeader } from "@/components/component/Dynamic-Header";
import { DataTable } from "@/components/component/Dynamic-Table";
import dayjs from "dayjs";

import OptionImg from "@/assets/imgs/optional-img.jpg";

import ClientDrawer from "./ClientDrawer";
import { NumberFormatter } from "@/components/component/Number-Formatter";
import { useQuery } from "@tanstack/react-query";
import {
  getClientsBusinessQuery,
  getClientsCustomersQuery,
} from "@/quires/quires";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientDrawerBusiness from "./ClientDrawerBusiness";

export default function Clients() {
  // const [page, setPage] = useState(1);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("customers");
  const { data: clientCustomer } = useQuery({
    ...getClientsCustomersQuery({
      limit: "1000",
      page: "1",
      search: searchTerm,
    }),
    enabled: activeTab === "customers",
  });
  const { data: clientBusiness } = useQuery({
    ...getClientsBusinessQuery({
      limit: "1000",
      page: "1",
      search: searchTerm,
    }),
    enabled: activeTab === "businesses",
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
              src={row?.original?.file || OptionImg}
              alt=""
              className="w-[80px] h-[55px] rounded-md object-cover"
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
    {
      accessorKey: "region",
      header: "region",
    },
    {
      accessorKey: "district",
      header: "district",
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

  const business = [
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
      accessorKey: "company_name",
      header: "Kompaniya",
    },
    {
      accessorKey: "full_name",
      header: "Direktor",
    },
    {
      accessorKey: "region",
      header: "region",
    },
    {
      accessorKey: "district",
      header: "district",
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
            <ClientDrawerBusiness
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
      <Tabs
        defaultValue="customers"
        value={activeTab}
        onValueChange={(val) => setActiveTab(val)}
        className="w-full mt-6"
      >
        <TabsList>
          <TabsTrigger value="customers">Jismoniy shaxs</TabsTrigger>
          <TabsTrigger value="businesses">Yuridik shaxs</TabsTrigger>
        </TabsList>
        <TabsContent value="customers">
          <DataTable
            data={clientCustomer?.data?.Data?.customers || []}
            columns={column}
          />
        </TabsContent>

        <TabsContent value="businesses">
          <DataTable
            data={clientBusiness?.data?.Data?.businesses || []}
            columns={business}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
