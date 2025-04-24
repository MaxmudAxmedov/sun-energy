import React, { useEffect, useState } from "react";
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
    const [totals, setTotals] = useState({
        qty: 0,
    });
    const item = data?.data?.Data;

    const total = item?.client_products?.reduce(
        (initial, obj) => {
            return {
                price: (initial.price += obj.total_price),
            };
        },
        { price: 0 }
    );

    useEffect(() => {
        if (item?.client_products) {
            const res = item?.client_products?.reduce(
                (acc, obj) => {
                    const itemSum = obj?.items?.reduce(
                        (sum, item) => ({
                            qty: sum.qty + item.quantity,
                        }),
                        { qty: 0 }
                    );
                    acc.qty += itemSum.qty;
                    return acc;
                },
                { qty: 0 }
            );
            setTotals(res);
        }
    }, [item?.client_products]);
    return (
        <div className="h-screen">
            <div className="flex justify-between gap-3 mt-4">
                <Card className="w-[22%] text-center pt-4">
                    <CardTitle className="mb-2">Contract</CardTitle>
                    <CardContent className="text-[22px]">
                        {item?.count}
                    </CardContent>
                </Card>
                <Card className="w-[22%] text-center pt-4">
                    <CardTitle className="mb-2">Products</CardTitle>
                    <CardContent className="text-[22px]">
                        {totals.qty}
                    </CardContent>
                </Card>
                <Card className="w-[22%] text-center pt-4">
                    <CardTitle className="mb-2">Total Price</CardTitle>
                    <CardContent className="text-[22px]">
                        {total?.price?.toLocaleString()}{" "}
                        <smal className="text-[16px]">sum</smal>
                    </CardContent>
                </Card>
                <Card className="w-[22%] text-center pt-4">
                    <CardTitle className="mb-2">Kvt</CardTitle>
                    <CardContent className="text-[22px]">
                        {item?.client_products?.reduce(
                            (sum, item) => (sum += item.kv),
                            0
                        )}
                    </CardContent>
                </Card>
            </div>
            {/* <ChartComponent data={data?.data}></ChartComponent> */}
            <ReCharts data={data?.data} />
        </div>
    );
}
