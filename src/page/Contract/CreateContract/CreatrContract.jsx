import React, { useEffect, useMemo, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import ContractTable from "./ContractTable";
import { useQuery } from "@tanstack/react-query";
import {
    getClientsBusinessQuery,
    getClientsCustomersQuery,
} from "@/quires/quires";

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
    do_calculate: z.boolean().default(false).optional(),
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

    // const { data: clientsData } = useGetData({
    //     endpoint: "/clients",
    //     enabled: true,
    //     getQueryKey: "/clients",
    // });
    const { data: clientCustomer } = useQuery({
        ...getClientsCustomersQuery({
            limit: "1000",
            page: "1",
            search: "",
        }),
    });

    const { data: clientBusiness } = useQuery({
        ...getClientsBusinessQuery({
            limit: "1000",
            page: "1",
            search: "",
        }),
    });
    const clientsData = useMemo(() => {
        const customers =
            clientCustomer?.data?.Data?.customers?.map((item) => ({
                ...item,
                type: "customer",
            })) || [];
        const businesses =
            clientBusiness?.data?.Data?.businesses?.map((item) => ({
                ...item,
                type: "business",
            })) || [];
        return [...customers, ...businesses];
    }, [clientCustomer, clientBusiness]);

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
            do_calculate: false,
            service_cost: 0,
            total_price: 0,
        },
    });

    const { watch, setValue } = form;
    const kvat = watch("kvat");
    const accessory_cost = watch("accessory_cost");
    const service_cost = watch("service_cost");
    const accessory = 200000;
    const service = 300000;

    useEffect(() => {
        const numericKvat = parseFloat(kvat);
        if (!isNaN(numericKvat)) {
            setValue("accessory_cost", numericKvat * accessory);
            setValue("service_cost", numericKvat * service);
        }
    }, [kvat, setValue]);

    const isCompany = useMemo(() => {
        if (params.id) {
            const selected = clientsData.find((item) => item.id === params.id);
            return !!selected?.full_name;
        }

        const selected = clientsData.find(
            (item) => item.id === form.watch("client_id")
        );
        return !!selected?.full_name;
    }, [params.id, clientsData, form]);

    const onSubmit = (data) => {
        const body = {
            ...data,
            accessory_cost: Number(data.accessory_cost),
            client_id: params.id ? params.id : data.client_id,
            order_items: products || [],
            service_cost: Number(data.service_cost),
            total_price: totalItem.price,
            kvat: Number(data.kvat),
            is_company: isCompany,
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
                                                            {clientsData?.length ===
                                                            0
                                                                ? t(
                                                                      "datasNotFound"
                                                                  )
                                                                : clientsData?.map(
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
                                                                                  {item?.full_name ||
                                                                                      item?.first_name}
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
                                                        {employeeData?.Data
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
                        <div className="flex items-center">
                            <FormField
                                control={form.control}
                                name="referred_by"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            htmlFor="client"
                                            className="text-gray-700 dark:text-white font-medium"
                                        >
                                            {t("attractor")}
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger
                                                    className="w-[240px] bg-white"
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
                                                        {employeeData?.Data
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

                            <FormField
                                control={form.control}
                                name="do_calculate"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between w-[60px] mt-6 p-2">
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
                                            Accessory cost
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
                                name="service_cost"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            htmlFor="service_cost"
                                            className="text-gray-700 dark:text-white font-medium"
                                        >
                                            Service cost
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
                    </div>

                    <div>
                        <ContractTable
                            serviceCost={service_cost}
                            accessoryCost={accessory_cost}
                            kvat={kvat}
                            setProducts={setProducts}
                        />
                    </div>
                </form>
            </Form>
        </div>
    );
}
