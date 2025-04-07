import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReportsQuery } from "@/quires/quires";
import ChartComponent from "./ReportChart";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import ReCharts from "./ReCharts";
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

    return (
        <div>
            <div className="flex justify-between gap-3 mt-4">
                <Card className="w-[22%] text-center pt-4">
                    <CardTitle className="mb-2">All Quantity</CardTitle>
                    <CardContent className="text-[22px]">
                        {item?.count}
                    </CardContent>
                </Card>
                <Card className="w-[22%] text-center pt-4">
                    <CardTitle className="mb-2">Total Items Sold</CardTitle>
                    <CardContent className="text-[22px]">
                        {item?.total_items_sold}
                    </CardContent>
                </Card>
                <Card className="w-[22%] text-center pt-4">
                    <CardTitle className="mb-2">Total Price</CardTitle>
                    <CardContent className="text-[22px]">
                        {(item?.total_trade)?.toLocaleString()} <smal className='text-[16px]'>sum</smal>
                    </CardContent>
                </Card>
                <Card className="w-[22%] text-center pt-4">
                    <CardTitle className="mb-2">Clients</CardTitle>
                    <CardContent className="text-[22px]">
                        {item?.unique_clients}
                    </CardContent>
                </Card>
            </div>
            {/* <ChartComponent data={data?.data}></ChartComponent> */}
            <ReCharts data={data?.data} />
        </div>
    );
}
