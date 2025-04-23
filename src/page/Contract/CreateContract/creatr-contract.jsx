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
import { NavLink, useParams } from "react-router-dom";
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
    employee_id: z
        .string()
        .min(1, "Please select an employee")
        .refine((value) => isValidUUID(value), {
            message: "Invalid employee ID format",
        }),
    referred_by: z
        .string()
        .min(1, "Please select an employee")
        .refine((value) => isValidUUID(value), {
            message: "Invalid employee ID format",
        }),
    kvat: 0,
});

export default function CreatrContract() {
    const { t } = useTranslation();
    const params = useParams();
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
    const { data: employeeData } = useGetData({
        endpoint: "/employees",
        enabled: true,
        getQueryKey: "/employees",
    });
    const form = useForm({
        // resolver: zodResolver(formSchema),
        defaultValues: {
            client_id: "",
            employee_id: "",
            referred_by: "",
            kvat: 0,
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
                product_id: i.product_id,
                quantity: i.count,
                total_price: i.total_price,
                unit_price: i.unit_price,
            };
        });
        const body = {
            ...data,
            accessory_cost: Number(data.accessory_cost),
            // dont_calculate: data.dont_calculate,
            client_id: params.id ? params.id : data.client_id,
            order_items: res,
            service_cost: Number(data.service_cost),
            total_price: totalItem.price,
            kvat: Number(data.kvat),
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
console.log(params);
    return (
        <div className="min-h-[100vh]">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {!params.id ? (
                            <div>
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
                                                    onValueChange={
                                                        field.onChange
                                                    }
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
                                                                : clientsData
                                                                      ?.Data
                                                                      ?.clients
                                                                      ?.length ===
                                                                  0
                                                                ? t(
                                                                      "datasNotFound"
                                                                  )
                                                                : clientsData?.Data?.clients?.map(
                                                                      (
                                                                          item
                                                                      ) => (
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
                        ) : (
                            ""
                        )}

                        <div>
                            <FormField
                                control={form.control}
                                name="employee_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            htmlFor="client"
                                            className="text-gray-700 dark:text-white font-medium"
                                        >
                                            {t("employee")}
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
                                                            : employeeData?.Data
                                                                  ?.employees
                                                                  ?.length === 0
                                                            ? t("datasNotFound")
                                                            : employeeData?.Data?.employees?.map(
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
                                                                                  item?.first_name
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
                                name="referred_by"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            htmlFor="client"
                                            className="text-gray-700 dark:text-white font-medium"
                                        >
                                            {t("referred")}
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
                                                            : employeeData?.Data
                                                                  ?.clients
                                                                  ?.length === 0
                                                            ? t("datasNotFound")
                                                            : employeeData?.Data?.employees?.map(
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
                                                                                  item?.first_name
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
                                name="kvat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            htmlFor="service_cost"
                                            className="text-gray-700 dark:text-white font-medium"
                                        >
                                            kvt
                                        </FormLabel>
                                        <FormControl>
                                            <Input
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

                        <div>
                            <FormField
                                control={form.control}
                                name="dont_calculate"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between min-w-[300px] mt-6 p-2">
                                            <FormLabel FormLabel="dont_calculate">
                                                Dont calculate
                                            </FormLabel>

                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                    id="airplane-mode"
                                                />
                                            </FormControl>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <TooltipProvider>
                            <div className="flex gap-3 w-[100%] mt-4 flex-wrap overflow-y-auto">
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

                        {/* <div className="relative mx-auto mt-4 w-[50%] ml-3 overflow-x-hidden rounded-lg bg-white dark:bg-darkSecondary p-4 dark:bg-darkMain">
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
                        </div> */}
                    </div>
                </form>
            </Form>
        </div>
    );
}
