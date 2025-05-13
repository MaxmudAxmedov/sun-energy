import React, { useEffect, useState } from "react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    AreaChart,
    Area,
} from "recharts";

export default function ReCharts({ data }) {
    const [item, setItem] = useState([]);

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!data || !data.Data) {
            setLoading(false);
            return;
        }
        const purchasedList = data.Data.client_products || [];

        const totalPrice = purchasedList.reduce(
            (sum, item) => sum + (item.total_price || 0),
            0
        );

        const res = purchasedList
            .map((i) => ({
                date: i.created_at,
                uv: i.total_count_of_product,
                pv: i.total_price,
                amt: totalPrice,
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        setItem(res);
        setLoading(false);
    }, [data]);

    if (loading) return <h1>Loading...</h1>;

    return (
        <div className="max-w-[1200px] overflow-x-auto mt-6">
            <AreaChart width={1100} height={500} data={item} syncId="anyId">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    angle={-25}
                    textAnchor="end"
                    height={80}
                    interval="preserveStartEnd"
                    minTickGap={15}
                />
                <YAxis />
                <Tooltip />
                <Area
                    type="monotone"
                    dataKey="pv"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                />
            </AreaChart>
        </div>
    );
}
