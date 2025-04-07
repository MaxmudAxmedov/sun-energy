import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    LogarithmicScale,
} from "chart.js";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    LogarithmicScale
);

const ChartComponent = ({ data }) => {
    const [chartData, setChartData] = useState({
        totalTrade: 0,
        totalItemsSold: 0,
        uniqueClients: 0,
        totalPrice: 0,
        totalCountOfProduct: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!data || !data.Data) {
            setLoading(false);
            return;
        }

        const totalTrade = data.Data.total_trade || 0;
        const totalItemsSold = data.Data.total_items_sold || 0;
        const uniqueClients = data.Data.unique_clients || 0;

        const purchasedList = data.Data.purchased || [];
        const totalPrice = purchasedList.reduce(
            (sum, item) => sum + (item.total_price || 0),
            0
        );
        const totalCountOfProduct = purchasedList.reduce(
            (sum, item) => sum + (item.total_count_of_product || 0),
            0
        );

        setChartData({
            totalTrade,
            totalItemsSold,
            uniqueClients,
            totalPrice,
            totalCountOfProduct,
        });
        setLoading(false);
    }, [data]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (
        !data ||
        !data.Data ||
        !data.Data.purchased ||
        data.Data.purchased.length === 0
    ) {
        return <div>No data available to display charts.</div>;
    }
    const barData = {
        labels: ["Total Trade", "Total Items Sold", "Unique Clients"],
        datasets: [
            {
                label: "Purchase Statistics",
                data: [
                    chartData.totalTrade,
                    chartData.totalItemsSold,
                    chartData.uniqueClients,
                ],
                backgroundColor: ["#ff9999", "#66b3ff", "#99ff99"],
                borderColor: ["#ff6666", "#3399ff", "#66cc66"],
                borderWidth: 1,
            },
        ],
    };

    const barOptions = {
        scales: {
            y: {
                beginAtZero: true,
                type: "logarithmic",
                ticks: {
                    callback: function (value) {
                        return Number(value).toLocaleString();
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || "";
                        if (label) {
                            label += ": ";
                        }
                        label += Number(context.parsed.y).toLocaleString();
                        return label;
                    },
                },
            },
        },
    };
    const pieData = {
        labels: ["Total Price", "Total Count of Product"],
        datasets: [
            {
                label: "Price vs Count of Product",
                data: [chartData.totalPrice, chartData.totalCountOfProduct],
                backgroundColor: ["#ff9999", "#66b3ff"],
                borderColor: ["#ff6666", "#3399ff"],
                borderWidth: 1,
            },
        ],
    };

    const pieOptions = {
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || "";
                        if (label) {
                            label += ": ";
                        }
                        label += Number(context.parsed).toLocaleString();
                        return label;
                    },
                },
            },
        },
    };

    return (
        <div style={{ padding: "20px" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    flexWrap: "wrap",
                }}
            >
                <div style={{ width: "500px", height: "400px" }}>
                    <h3>Bar Chart</h3>
                    <Bar data={barData} options={barOptions} />
                </div>

                <div style={{ width: "400px", height: "400px" }}>
                    <h3>Pie Chart</h3>
                    <Pie data={pieData} options={pieOptions} />
                </div>
            </div>
        </div>
    );
};

export default ChartComponent;
