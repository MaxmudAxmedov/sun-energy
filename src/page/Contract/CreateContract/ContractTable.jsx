import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getProductsQuery } from "@/quires/quires";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import OptionalImage from "@/assets/imgs/optional-img.jpg";
import ContractDrawer from "./ContractDrawer";
export default function ContractTable({ setProducts }) {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [localProducts, setLocalProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const { data, isLoading } = useQuery({
        ...getProductsQuery({ limit: 500, search: searchTerm }),
        staleTime: Infinity,
        cacheTime: 0,
    });

    useEffect(() => {
        if (data?.data?.Data?.products) {
            setLocalProducts(data?.data?.Data?.products);
        }
    }, [data]);

    const handleCountChange = (product, delta) => {
        setSelectedProducts((prev) => {
            const exists = prev.find((p) => p.product_id === product.id);
            if (exists) {
                const updated = prev.map((p) => {
                    if (p.product_id === product.id) {
                        const newQuantity = Math.max(0, p.quantity + delta);
                        return {
                            ...p,
                            quantity: newQuantity,
                            total_price: newQuantity * p.retail_price,
                        };
                    }
                    return p;
                });
                return updated.filter((p) => p.quantity > 0);
            } else if (delta > 0) {
                return [
                    ...prev,
                    {
                        product_id: product.id,
                        quantity: 1,
                        retail_price: product.selling_price,
                        total_price: product.selling_price * 1,
                    },
                ];
            }
            return prev;
        });
        setLocalProducts((prev) =>
            prev.map((p) => {
                if (p.id === product.id) {
                    const newCount = Math.max(0, p.count_of_product - delta);
                    return { ...p, count_of_product: newCount };
                }
                return p;
            })
        );
    };

    useEffect(() => {
        setProducts(selectedProducts);
    }, [selectedProducts]);

    const totalPrice = selectedProducts.reduce(
        (sum, p) => sum + p.quantity * p.retail_price,
        0
    );

    const infoClick = (row) => () => {
        setSelectedRowData(row);
        setIsSheetOpen(true);
    };
    return (
        <div className="w-full max-h-[70vh] overflow-auto bg-white dark:bg-darkSecondary p-4 dark:bg-darkMain rounded-lg">
            <div className="flex justify-between items-center">
                <div className="w-8/12">
                    <Input
                        placeholder="qidirish"
                        onInput={(e) => setSearchTerm(e?.target?.value)}
                    />
                </div>
                <div>
                    <p className="text-[12px]">Umumiy summa </p>
                    <p className="font-semibold">
                        {totalPrice.toLocaleString()} so'm
                    </p>
                </div>
            </div>
            <Table className="relative">
                <TableHeader>
                    <TableRow className="bg-mauiMist dark:bg-darkMainSecond w-[100%]">
                        <TableHead>N</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Nomi</TableHead>
                        <TableHead>Batafsil</TableHead>
                        <TableHead>Mahsulot soni</TableHead>
                        <TableHead>Sotuv narxi</TableHead>
                        <TableHead>Umumiy narx</TableHead>
                        <TableHead>Qo'shish</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {localProducts?.map((item, index) => {
                        const current = selectedProducts.find(
                            (p) => p.product_id === item.id
                        );
                        const count = current?.quantity || 0;

                        return (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="relative">
                                    <img
                                        className="w-[80px] h-[55px] rounded-md"
                                        src={item.photo || OptionalImage}
                                        alt={item.name || ""}
                                    />
                                    {item.watt !== 0 && (
                                        <span className="absolute -top-2.5 -left-3 bg-primaryColor text-white text-[10px] py-[2px] px-1.5 rounded-md">
                                            {item.watt} W
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <ContractDrawer
                                        isSheetOpen={isSheetOpen}
                                        setIsSheetOpen={setIsSheetOpen}
                                        row={item}
                                        selectedRowData={selectedRowData}
                                        infoClick={infoClick}
                                    />
                                </TableCell>
                                <TableCell className="text-wrap w-[20%]">
                                    {item.description}
                                </TableCell>
                                <TableCell>{item.count_of_product}</TableCell>
                                <TableCell>
                                    {item.selling_price.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    {count > 0
                                        ? (
                                              item.selling_price * count
                                          ).toLocaleString()
                                        : "-"}
                                </TableCell>
                                <TableCell className="w-[15%]">
                                    {count > 0 ? (
                                        <div className="flex justify-between w-full mx-auto">
                                            <Button
                                                variant="destructive"
                                                className="w-[30%]"
                                                type="button"
                                                onClick={() =>
                                                    handleCountChange(item, -1)
                                                }
                                            >
                                                -
                                            </Button>
                                            <p className="border w-[35%] rounded px-3 pt-[5px] text-center">
                                                {count}
                                            </p>
                                            <Button
                                                className="w-[30%]"
                                                type="button"
                                                disabled={
                                                    item.count_of_product == 0
                                                }
                                                onClick={() =>
                                                    handleCountChange(item, 1)
                                                }
                                            >
                                                +
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            disabled={
                                                item.count_of_product === 0
                                            }
                                            className="w-[100%]"
                                            onClick={() =>
                                                handleCountChange(item, 1)
                                            }
                                        >
                                            Add
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
