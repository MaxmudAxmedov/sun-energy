import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGetData } from "@/hook/useApi";
import { useMutateData } from "@/hook/useApi";
import { Spinner } from "@/components/component/spinner";
import { NavLink } from "react-router-dom";
import ProductItem from "./ProductItem";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const isValidUUID = (uuid) => {
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuid && typeof uuid === "string" && uuidRegex.test(uuid);
};

const formSchema = z.object({
    // count_of_product: z.string().min(1, {
    //     message: "countOfProductRequired",
    // }),
    // total_price: z.string().min(1, {
    //     message: "totalPriceRequired",
    // }),
    // product_id: z
    //     .string()
    //     .min(1, "Please select an employee")
    //     .refine((value) => isValidUUID(value), {
    //         message: "Invalid employee ID format",
    //     }),
    client_id: z
        .string()
        .min(1, "Please select an employee")
        .refine((value) => isValidUUID(value), {
            message: "Invalid employee ID format",
        }),
    accessory_cost: z.string().min(1, {
        message: "Accessory cost",
    }),
    dont_calculate: z.boolean().default(false).optional(),
    service_cost: z.string().min(1, {
        message: "Service cost",
    }),
});

export default function CreatrContract() {
    const { t } = useTranslation();
    const { mutate, isLoading: isMutating, isSuccess } = useMutateData();
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem("products");
        return saved ? JSON.parse(saved) : [];
    });
    const [totalItem, setTotalItem] = useState({
        quantity: 0,
        price: 0,
    });
    const {
        data: productsData,
        isLoading: productsLoading,
        isError: productsIsError,
    } = useGetData({
        endpoint: "/products",
        enabled: true,
        getQueryKey: "/products",
    });

    const { data: clientsData } = useGetData({
        endpoint: "/clients",
        enabled: true,
        getQueryKey: "/clients",
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            client_id: "",
            accessory_cost: 0,
            dont_calculate: false,
            service_cost: 0,
            total_price: 0,
        },
    });

    const onSubmit = (data) => {
        console.log(data);
        const res = products.map((i) => {
            return {
                kvat: Number(i.kvat),
                product_id: i.product_id,
                quantity: i.count,
                total_price: i.total_price,
                unit_price: i.unit_price,
            };
        });
        const body = {
            accessory_cost: Number(data.accessory_cost),
            dont_calculate: data.dont_calculate,
            client_id: data.client_id,
            order_items: res,
            service_cost: Number(data.service_cost),
            total_price: totalItem.price,
        };
        mutate({
            endpoint: "/trade",
            data: body,
            navigatePath: "/contract",
            toastCreateMessage: "contractCreated",
            mutateQueryKey: "/trades",
        });
        localStorage.removeItem("products");
    };

    useEffect(() => {
        const total = products.reduce(
            (sum, item) => {
                return {
                    quantity: sum.quantity + Number(item.count),
                    price: sum.price + Number(item.total_price),
                };
            },
            { quantity: 0, price: 0 }
        );

        localStorage.setItem("products", JSON.stringify(products));
        setTotalItem(total);
    }, [products]);

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3"
                >
                    <div className="flex justify-between">
                        <h1 className="text-2xl font-bold mb-8 pt-6">
                            {t("contract")}
                        </h1>
                        <div className="flex items-center gap-4">
                            <NavLink
                                to={"/contract"}
                                type="reset"
                                className="w-[120px] text-center bg-red-500 text-white py-[6px] px-2 rounded-md transition-all duration-150 hover:bg-red-400"
                                onClick={() =>
                                    localStorage.removeItem("products")
                                }
                            >
                                {t("cencel")}
                            </NavLink>
                            <Button type="submit">
                                {isMutating ? <Spinner /> : t("submit")}
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2">
                        <div className="flex flex-wrap gap-4">
                            <FormField
                                control={form.control}
                                name="client_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            htmlFor="client"
                                            className="text-gray-700 dark:text-white font-medium"
                                        >
                                            {t("clients")}
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger
                                                    className="w-[300px] bg-white"
                                                    {...field}
                                                >
                                                    <SelectValue
                                                        placeholder={t(
                                                            "enterClients"
                                                        )}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {productsLoading
                                                            ? t("loading")
                                                            : productsIsError
                                                            ? "Error"
                                                            : clientsData?.Data
                                                                  ?.clients
                                                                  ?.length === 0
                                                            ? t("datasNotFound")
                                                            : clientsData?.Data?.clients?.map(
                                                                  (item) => (
                                                                      <SelectGroup
                                                                          key={
                                                                              item.id
                                                                          }
                                                                      >
                                                                          <SelectItem
                                                                              value={
                                                                                  item.id
                                                                              }
                                                                          >
                                                                              {
                                                                                  item?.full_name
                                                                              }
                                                                          </SelectItem>
                                                                      </SelectGroup>
                                                                  )
                                                              )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div>
                            <FormField
                                control={form.control}
                                name="accessory_cost"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            htmlFor="accessory_cost"
                                            className="text-gray-700 dark:text-white font-medium"
                                        >
                                            {/* {t("name")}* */}
                                            Accessory cost
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                // placeholder={t("enterName")}
                                                {...field}
                                                className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="dont_calculate"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-4 p-3">
                                        <div>
                                            <FormLabel>
                                                Dont calculate
                                            </FormLabel>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                id="airplane-mode"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div>
                            <FormField
                                control={form.control}
                                name="service_cost"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            htmlFor="service_cost"
                                            className="text-gray-700 dark:text-white font-medium"
                                        >
                                            {/* {t("name")}* */}
                                            Service cost
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                // placeholder={t("enterName")}
                                                {...field}
                                                className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <TooltipProvider>
                            <div className="flex gap-3 w-[65%] mt-4 flex-wrap overflow-y-auto">
                                {productsData?.Data?.products?.map((item) => {
                                    return (
                                        <ProductItem
                                            item={item}
                                            key={item.id}
                                            setProducts={setProducts}
                                            products={products}
                                        />
                                    );
                                })}
                            </div>
                        </TooltipProvider>

                        <div className="relative mx-auto mt-4 w-[50%] ml-3 overflow-x-hidden rounded-lg bg-white dark:bg-darkSecondary p-4 dark:bg-darkMain">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-mauiMist dark:bg-darkMainSecond">
                                        <TableHead>N</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="text-end">
                                            quantity
                                        </TableHead>
                                        <TableHead className="text-end">
                                            price
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products?.map((item, index) => {
                                        return (
                                            <TableRow>
                                                <TableCell>
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="w-[30%]">
                                                    {item.product_name}
                                                </TableCell>
                                                <TableCell className="text-end">
                                                    {item.count}
                                                </TableCell>
                                                <TableCell className="text-end">
                                                    {item.total_price.toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                                <TableFooter>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell className="text-end">
                                        <p>{totalItem.quantity}</p>
                                    </TableCell>
                                    <TableCell className="text-end">
                                        <p>
                                            {totalItem.price.toLocaleString()}{" "}
                                            sum
                                        </p>
                                    </TableCell>
                                </TableFooter>
                            </Table>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
