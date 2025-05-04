import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReportsQuery } from "@/quires/quires";
import ChartComponent from "./ReportChart";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import ReCharts from "./ReCharts";
import DateRangePicker from "@/components/component/DateRangePicker";
import { DynamicHeader } from "@/components/component/Dynamic-Header";
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

    const [range, setRange] = useState({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(),
    });

    const handleDateChange = (newRange) => {
        setRange(newRange);
        const start = newRange.startDate.toISOString().split("T")[0];
        const end = newRange.endDate.toISOString().split("T")[0];
        setParams((res) => ({ ...res, from_date: start, to_date: end }));
    };

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
            <DynamicHeader title="Hisobot" isCreat={false}>
                <DateRangePicker value={range} onChange={handleDateChange} />
            </DynamicHeader>
            <div className="flex justify-between gap-3 mt-4">
                <Card className="w-[22%] text-center pt-4">
                    <CardTitle className="mb-2">Shartnomalar</CardTitle>
                    <CardContent className="text-[22px]">
                        {/* {item?.count} */}
                        {item?.count}
                    </CardContent>
                </Card>
                <Card className="w-[22%] text-center pt-4">
                    <CardTitle className="mb-2">Kvt</CardTitle>
                    <CardContent className="text-[22px]">
                        {item?.total_kv}
                    </CardContent>
                </Card>
                <Card className="w-[22%] text-center pt-4">
                    <CardTitle className="mb-2">Foyda</CardTitle>
                    <CardContent className="text-[22px]">
                        {item?.profit.toLocaleString()}{" "}
                        <smal className="text-[16px]">sum</smal>
                    </CardContent>
                </Card>
                <Card className="w-[22%] text-center pt-4">
                    <CardTitle className="mb-2">Tan narx bo'yicha</CardTitle>
                    <CardContent className="text-[22px]">
                        {item?.total_cost.toLocaleString()}{" "}
                        <smal className="text-[16px]">sum</smal>
                    </CardContent>
                </Card>
                <Card className="w-[22%] text-center pt-4">
                    <CardTitle className="mb-2">Umumiy summa</CardTitle>
                    <CardContent className="text-[22px]">
                        {item?.total_selling.toLocaleString()}{" "}
                        <smal className="text-[16px]">sum</smal>
                    </CardContent>
                </Card>
            </div>
            {/* <ChartComponent data={data?.data}></ChartComponent> */}
            <ReCharts data={data?.data} />
        </div>
    );
}
