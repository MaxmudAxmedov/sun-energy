import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReportsQuery } from "@/quires/quires";
import ChartComponent from "./ReportChart";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
const initialParams = {
    product_name: "",
    client_name: "",
    page: "1",
    limit: "10",
};
export default function Report() {
    const [params, setParams] = useState(initialParams);
    const { data } = useQuery({ ...getReportsQuery(params) });
    const item = data?.data?.Data;
    console.log(item);
    return (
        <div>
            <div className="flex justify-between gap-3 mt-3">
                <Card className="w-[20%] text-center pt-4">
                    <CardTitle className="mb-2">All Quantity</CardTitle>
                    <CardContent>{item?.count}</CardContent>
                </Card>
                <Card className="w-[20%] text-center pt-4">
                    <CardTitle className="mb-2">Total Items Sold</CardTitle>
                    <CardContent>{item?.total_items_sold}</CardContent>
                </Card>
                <Card className="w-[20%] text-center pt-4">
                    <CardTitle className="mb-2">Total Price</CardTitle>
                    <CardContent>{item?.total_trade}</CardContent>
                </Card>
                <Card className="w-[20%] text-center pt-4">
                    <CardTitle className="mb-2">Clients</CardTitle>
                    <CardContent>{item?.unique_clients}</CardContent>
                </Card>
            </div>
            <ChartComponent data={data?.data}></ChartComponent>
        </div>
    );
}
