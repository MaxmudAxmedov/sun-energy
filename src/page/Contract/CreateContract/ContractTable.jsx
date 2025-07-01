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
import { forceConvertDomain } from "@/lib/forceConvertDomain";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGetData } from "@/hook/useApi";

export default function ContractTable({
    setProducts,
    kvat,
    serviceCost,
    accessoryCost,
}) {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [localProducts, setLocalProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const { data, isLoading } = useQuery({
        ...getProductsQuery({ limit: 500, search: searchTerm }),
        staleTime: Infinity,
        cacheTime: 0,
    });
    const { data: categorys } = useGetData({
        endpoint: "/product-categories",
        enabled: true,
        params: {
            limit: 30,
            search: searchTerm,
        },
        getQueryKey: "/product-category",
    });

    useEffect(() => {
        if (categorys) {
            const res = categorys?.Data?.product_categories?.map((item) => ({
                value: String(item?.id),
                label: item?.name,
            }));
            setCategories(res);
            if (res?.length) {
                setSelectedCategory(res[0]?.value);
            }
        }
    }, [categorys]);

    useEffect(() => {
        if (data?.data?.Data?.products) {
            setLocalProducts(data?.data?.Data?.products);
        }
    }, [data]);

    const updateQuantity = (product, delta) => {
        setSelectedProducts((prev) => {
            const exists = prev.find((p) => p.product_id === product.id);
            if (exists) {
                const newQuantity = exists.quantity + delta;
                if (newQuantity <= 0) {
                    return prev.filter((p) => p.product_id !== product.id);
                }
                return prev.map((p) =>
                    p.product_id === product.id
                        ? {
                              ...p,
                              quantity: newQuantity,
                              total_price: newQuantity * +p.selling_price,
                          }
                        : p
                );
            } else if (delta > 0) {
                return [
                    ...prev,
                    {
                        price: +product.price,
                        product_id: product.id,
                        quantity: delta,
                        selling_price: +product.selling_price,
                        total_price: +product.selling_price * delta,
                    },
                ];
            }
            return prev;
        });

        setLocalProducts((prev) =>
            prev.map((p) => {
                if (p.id === product.id) {
                    const usedCount =
                        selectedProducts.find(
                            (sp) => sp.product_id === product.id
                        )?.quantity || 0;
                    const remaining = Math.max(
                        0,
                        product.count_of_product +
                            usedCount -
                            (usedCount + delta)
                    );
                    return { ...p, count_of_product: remaining };
                }
                return p;
            })
        );
    };

    const handleInputChange = (product, value) => {
        const newValue = parseInt(value) || 0;
        if (newValue < 0) return;

        const old = selectedProducts.find((p) => p.product_id === product.id);
        const oldQuantity = old?.quantity || 0;
        const delta = newValue - oldQuantity;
        updateQuantity(product, delta);
    };

    useEffect(() => {
        setProducts(selectedProducts);
    }, [selectedProducts]);

    const totalPrice = selectedProducts?.reduce(
        (sum, p) => sum + p.quantity * p.selling_price,
        0
    );

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);

        const filtered = localProducts?.filter(
            (product) => String(product?.category_id) === value
        );

        setFilteredProducts(filtered);
    };

    const infoClick = (row) => () => {
        setSelectedRowData(row);
        setIsSheetOpen(true);
    };
    const numericKvat = parseFloat(kvat);
    return (
        <div className="w-full max-h-[70vh] overflow-auto bg-white dark:bg-darkSecondary p-4 dark:bg-darkMain rounded-lg">
            <div className="flex justify-between items-center sticky top-[-16px] z-10 bg-white dark:bg-darkSecondary p-2">
                <div className="w-6/12 flex gap-2">
                    <Input
                        placeholder="qidirish"
                        onInput={(e) => setSearchTerm(e?.target?.value)}
                    />
                    <Select
                        value={selectedCategory}
                        onValueChange={handleCategoryChange}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Kategoriyani tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories?.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex justify-between w-5/12">
                    <span className="flex flex-col gap-1">
                        <strong>Acc va Ser</strong>
                        {(
                            Number(serviceCost) + Number(accessoryCost)
                        ).toLocaleString()}{" "}
                        sum
                    </span>

                    <span className="flex flex-col gap-1">
                        <strong>Mahsulotlar</strong>
                        {totalPrice?.toLocaleString()} sum
                    </span>

                    <span className="flex flex-col gap-1">
                        <strong>Umumiy summa</strong>
                        {(
                            numericKvat * Number(serviceCost) +
                            numericKvat * Number(accessoryCost) +
                            totalPrice
                        ).toLocaleString()}
                        sum
                    </span>
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
                    {filteredProducts?.map((item, index) => {
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
                                        src={
                                            forceConvertDomain(item.photo) ||
                                            OptionalImage
                                        }
                                        alt={item.name || ""}
                                    />
                                    {item.watt !== 0 && (
                                        <span className="absolute -top-1 -left-3 bg-primaryColor text-white text-[10px] py-[2px] px-1.5 rounded-md">
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
                                    {item.description.split(" ").length > 10
                                        ? item.description
                                              .split(" ")
                                              .slice(0, 10)
                                              .join(" ") + "..."
                                        : item.description}
                                </TableCell>
                                <TableCell>{item.count_of_product}</TableCell>
                                <TableCell>
                                    {Number(
                                        item.selling_price
                                    ).toLocaleString()}
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
                                        <div className="flex justify-between w-full mx-auto gap-2">
                                            <Button
                                                variant="destructive"
                                                className="w-[30%]"
                                                type="button"
                                                onClick={() =>
                                                    updateQuantity(item, -1)
                                                }
                                            >
                                                -
                                            </Button>

                                            <Input
                                                value={count}
                                                onChange={(e) => {
                                                    let value = parseInt(
                                                        e.target.value
                                                    );
                                                    if (isNaN(value)) value = 0;
                                                    if (
                                                        value >=
                                                        item.count_of_product
                                                    )
                                                        value =
                                                            item.count_of_product;
                                                    handleInputChange(
                                                        item,
                                                        value
                                                    );
                                                }}
                                                className="w-[50px] bg-white text-center p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                                            />

                                            <Button
                                                className="w-[30%]"
                                                type="button"
                                                disabled={
                                                    item.count_of_product == 0
                                                }
                                                onClick={() =>
                                                    updateQuantity(item, 1)
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
                                                updateQuantity(item, 1)
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
