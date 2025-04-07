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
    const [item, setItem] = useState([
        {
            name: "one",
            uv: 23453435,
            pv: 43543335,
            amt: 323040404,
        },
        {
            name: "two",
            uv: 23345535,
            pv: 4354333335,
            amt: 323040404,
        },
        {
            name: "three",
            uv: 233435,
            pv: 433333335,
            amt: 323040404,
        },
    ]);

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!data || !data.Data) {
            setLoading(false);
            return;
        }
        const purchasedList = data.Data.purchased || [];
        const totalPrice = purchasedList.reduce(
            (sum, item) => sum + (item.total_price || 0),
            0
        );

        const res = purchasedList.map((i) => {
            return {
                name: i.product_name,
                uv: i.total_count_of_product,
                pv: i.total_price,
                amt: totalPrice,
            };
        }, {});
        setItem((prev) => ([...prev, ...res]));
        setLoading(false);
    }, [data]);

    if (loading) return <h1>Loading...</h1>;

    return (
        <div className="mt-6">
            <AreaChart width={1450} height={500} data={item} syncId="anyId">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
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
