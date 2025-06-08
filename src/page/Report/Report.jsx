import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReportsQuery, getTradesQuery } from "@/quires/quires";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import ReCharts from "./ReCharts";
import DateRangePicker from "@/components/component/DateRangePicker";
import { DynamicHeader } from "@/components/component/Dynamic-Header";
const initialParams = {
    from_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to_date: new Date(),
};

const paramsTrade = {
    client_id: "",
    employee_id: "",
    from_date: "",
    to_date: "",
    // is_company: false,
    page: "1",
    limit: "10",
};
export default function Report() {
    const [params, setParams] = useState(initialParams);
    const [paramTrade, setParamTrade] = useState(paramsTrade);
    const { data } = useQuery({ ...getReportsQuery(params) });
    const { data: tradeData } = useQuery({ ...getTradesQuery(paramTrade) });
    const item = data?.data?.Data;
    const trade = tradeData?.data?.Data;

    const [range, setRange] = useState({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(),
    });

    const handleDateChange = (newRange) => {
        setRange(newRange);
        const start = newRange.startDate.toISOString().split("T")[0];
        const end = newRange.endDate.toISOString().split("T")[0];
        setParams((res) => ({ ...res, from_date: start, to_date: end }));
        setParamTrade((res) => ({ ...res, from_date: start, to_date: end }));
    };

    return (
        <div className="h-screen">
            <DynamicHeader title="Hisobot" isCreat={false}>
                <DateRangePicker value={range} onChange={handleDateChange} />
            </DynamicHeader>
            <div className="flex justify-between gap-3 mt-4">
                <Card className="w-[22%] text-center pt-4">
                    <CardTitle className="mb-2">Kvt</CardTitle>
                    <CardContent className="text-[22px]">
                        {item?.total_kv || 0}
                    </CardContent>
                </Card>

                <Card className="w-[22%] text-center pt-4">
                    <CardTitle className="mb-2">Accessory</CardTitle>
                    <CardContent className="text-[22px]">
                        {Number(item?.total_accessory)?.toLocaleString() || 0}{" "}
                        <smal className="text-[16px]">sum</smal>
                    </CardContent>
                </Card>

                <Card className="w-[22%] text-center pt-4">
                    <CardTitle className="mb-2">Foyda</CardTitle>
                    <CardContent className="text-[22px]">
                        {/* {Number(item?.profit)?.toLocaleString() || 0}{" "} */}
                        {Number(item?.total_extra_expenses)?.toLocaleString() ||
                            0}{" "}
                        <smal className="text-[16px]">sum</smal>
                    </CardContent>
                </Card>
                <Card className="w-[22%] text-center pt-4">
                    <CardTitle className="mb-2">Tan narx bo'yicha</CardTitle>
                    <CardContent className="text-[22px]">
                        {Number(item?.total_cost)?.toLocaleString() || 0}{" "}
                        <smal className="text-[16px]">sum</smal>
                    </CardContent>
                </Card>
                <Card className="w-[22%] text-center pt-4">
                    <CardTitle className="mb-2">Umumiy summa</CardTitle>
                    <CardContent className="text-[22px]">
                        {Number(item?.total_selling)?.toLocaleString() || 0}{" "}
                        <smal className="text-[16px]">sum</smal>
                    </CardContent>
                </Card>
            </div>
            <ReCharts data={tradeData?.data} />
        </div>
    );
}
