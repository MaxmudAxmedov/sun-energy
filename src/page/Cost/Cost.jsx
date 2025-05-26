import { CustomDeleteDialog } from "@/components/component/Custom-Delete-Dialog";
import { DynamicHeader } from "@/components/component/Dynamic-Header";
import { DataTable } from "@/components/component/Dynamic-Table";
import { getExpensesQuery } from "@/quires/quires";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialParams = {
    limit: "10",
    page: "1",
    search: "",
};

export default function Cost() {
    const [params, setParams] = useState(initialParams);
    const { data } = useQuery(getExpensesQuery(params));
    const navigate = useNavigate();
    const column = [
        {
            header: "No",
            cell: ({ row }) => {
                return <div>{row.index + 1}</div>;
            },
        },
        {
            accessorKey: "name",
            header: "name",
            cell: ({ row }) => {
                return (
                    <div
                        onClick={() => navigate(`/editCost/${row.original.id}`)}
                        className="cursor-pointer"
                    >
                        {row.original.name}
                    </div>
                );
            },
        },
        {
            header: "price",
            cell: ({ row }) => {
                return (
                    <div>{Number(row.original.amount).toLocaleString()}</div>
                );
            },
        },
        {
            accessorKey: "description",
            header: "info",
        },

        {
            header: "createdAt",
            cell: ({ row }) => {
                return <div>{row.original.created_at}</div>;
            },
        },
        {
            header: "actions",
            cell: ({ row }) => {
                return (
                    <div>
                        <CustomDeleteDialog
                            dynamicRowId={row.original.id}
                            endpoint={`expense`}
                            mutateQueryKey={"expenses"}
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
                title="additional_expense"
                btnName="create"
                inputPlacholder="searchCost"
                btnNavigate="/createCost"
            />

            <div>
                <DataTable
                    data={data?.data?.Data?.extra_expenses || []}
                    columns={column}
                />
            </div>
        </div>
    );
}
