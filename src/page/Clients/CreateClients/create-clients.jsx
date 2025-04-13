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
import { clientAddressData } from "@/data/viloyatlar";
import { NavLink, useParams } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getClientById } from "@/service/client";
import { useQuery } from "@tanstack/react-query";
const isValidUUID = (uuid) => {
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuid && typeof uuid === "string" && uuidRegex.test(uuid);
};

// const formSchema = z.object({
//   full_name: z.string().min(1, {
//     message: "firstNameRequired",
//   }),
//   street: z.string().min(1, {
//     message: "streetRequired",
//   }),
//   region: z.string().min(1, {
//     message: "provinceRequired",
//   }),
//   district: z.string().min(1, {
//     message: "districtRequired",
//   }),
//   inn_number: z.string().optional(),
//   company_name: z.string().optional(),
//   percent_for_employee_custom: z.string().optional(),
//   employee_id: z
//     .string()
//     .min(1, "Please select an employee")
//     .refine((value) => isValidUUID(value), {
//       message: "Invalid employee ID format",
//     }),
//   is_company: z.boolean().optional(),
//   referred_id: z
//     .string()
//     .min(1, "Please select an referred")
//     .refine((value) => isValidUUID(value), {
//       message: "Invalid referred ID format",
//     }),
//   phone: z
//     .string()
//     .min(9, {
//       message: "phoneNumberRequired",
//     })
//     .max(9, {
//       message: "phoneNumberInvalid",
//     })
//     .refine((value) => /^\d{9}$/.test(value), {
//       message: "phoneNumberRequired",
//     }),
//   passport_series: z
//     .string()
//     .min(1, { message: "Pasport seriyasi kiritilishi shart" })
//     .regex(/^[A-Z]{2}\d{7}$/, {
//       message: "Pasport seriyasi AA1234567 formatida bo‘lishi kerak",
//     }),
// });

export const formSchema = z.object({
    company_name: z.string(),
    district: z.string(),
    employee_id: z.string(),
    full_name: z
        .string()
        .min(3, "Ism kamida 3 ta harfdan iborat bo'lishi kerak"),
    inn_number: z.string(),
    is_company: z.boolean(),
    passport_series: z
        .string()
        .regex(
            /^[A-Z]{2}\d{7}$/,
            "Pasport seriyasi noto‘g‘ri formatda (masalan: AA1234567)"
        ),
    phone: z.string().min(9),
    referred_id: z.string(),
    region: z.string(),
    street: z.string(),
});

export default function CreateClients() {
    const { t } = useTranslation();
    const { id } = useParams();
    const { mutate, isLoading: isMutating } = useMutateData();
    const prefix = "+998";
    const prefixServer = "998";
    const [selectedTab, setSelectedTab] = useState("jismoniy");
    const { data: userData } = useGetData({
        endpoint: "/users",
        enabled: true,
        getQueryKey: "/users",
    });
    const percent_for_employee = userData?.Data?.users?.map(
        (users) => users?.percent_for_employee
    );
    const { data: clientData, error } = useQuery({
        queryKey: ["client", id],
        queryFn: () => getClientById(id),
        enabled: !!id,
    });

    const {
        data: employeesData,
        isLoading,
        isError,
    } = useGetData({
        endpoint: "/employees",
        enabled: true,
        getQueryKey: "/employees",
    });

    const {
        data: clientsData,
        isLoading: clientsLoading,
        isError: clientsError,
    } = useGetData({
        endpoint: "/clients",
        enabled: true,
        getQueryKey: "/clients",
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            full_name: "",
            phone: "",
            employee_id: "",
            street: "",
            region: "",
            district: "",
            passport_series: "",
            is_company: false,
            referred_id: "",
            inn_number: "",
            company_name: "",
            percent_for_employee_custom: 0,
        },
    });

    useEffect(() => {
        if (clientData && id) {
            const client = clientData?.data;
            form.reset({
                full_name: client.full_name,
                phone: client.phone,
                employee_id: client.employee_id,
                street: client.street,
                region: client.region,
                district: client.district,
                passport_series: client.passport_series,
                is_company: client.is_company,
                referred_id: client.referred_id,
                inn_number: client.inn_number,
                company_name: client.company_name,
                percent_for_employee_custom: client.percent_for_employee_custom,
            });
            console.log(client);
            if (client?.is_company) {
                setSelectedTab("yuridik");
            } else {
                setSelectedTab("jismoniy");
            }
        }
    }, [clientData, id]);

    const selectedProvince = form.watch("region");
    const setValues = form.setValue;

    const onSubmitIndividual = (data) => {
        const {
            full_name,
            phone,
            employee_id,
            street,
            region,
            district,
            passport_series,
            referred_id,
            is_company,
            inn_number,
            company_name,
            percent_for_employee_custom,
        } = data;

        const fullPhoneNumber = `${prefixServer}${phone}`;
        const finalData = {
            phone: fullPhoneNumber,
            full_name,
            employee_id,
            passport_series,
            street,
            region,
            district,
            referred_id,
            percent_for_employee:
                percent_for_employee_custom || percent_for_employee?.[0],
            is_company: is_company || false,
            inn_number: Number(inn_number) || null,
            company_name: company_name || null,
        };
        mutate({
            endpoint: "/client",
            method: "POST",
            data: finalData,
            navigatePath: "/clients",
            toastCreateMessage: "clientCreated",
            mutateQueryKey: "/clients",
        });
    };

    const onSubmitLegal = (data) => {
        const {
            full_name,
            phone,
            employee_id,
            street,
            region,
            district,
            passport_series,
            referred_id,
            is_company,
            inn_number,
            company_name,
        } = data;

        const fullPhoneNumber = `${prefixServer}${phone}`;
        const finalData = {
            phone: fullPhoneNumber,
            full_name,
            employee_id,
            passport_series,
            street,
            region,
            district,
            referred_id,
            is_company,
            inn_number: Number(inn_number),
            company_name,
        };
        mutate({
            endpoint: "/client-company",
            method: "POST",
            data: finalData,
            navigatePath: "/clients",
            toastCreateMessage: "clientCreated",
            mutateQueryKey: "/clients",
        });
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 pt-6">
                {id ? "Edit client" : t("createClient")}
            </h1>

            <Tabs
                className="w-full"
                value={selectedTab}
                onValueChange={setSelectedTab}
            >
                <TabsList className="grid max-w-[460px] grid-cols-2">
                    <TabsTrigger className="max-w-[230px]" value="jismoniy">
                        {t("individualsClients")}
                    </TabsTrigger>
                    <TabsTrigger className="max-w-[230px]" value="yuridik">
                        {t("legalClients")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="jismoniy">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmitIndividual)}
                            className="space-y-8"
                        >
                            <div className="flex flex-wrap gap-4">
                                {/* Full Name */}
                                <FormField
                                    control={form.control}
                                    name="full_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="full_name"
                                                className="text-gray-700 dark:text-white font-medium"
                                            >
                                                {t("fullName")}*
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        "enterFullName"
                                                    )}
                                                    {...field}
                                                    className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Phone Number */}
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="phone"
                                                className="text-gray-700  dark:text-white font-medium"
                                            >
                                                {t("phoneNumber")}*
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <div className="flex bg-white w-[300px] items-center border-[1.6px] rounded-[8px] overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-within:border-primary dark:bg-darkBgInputs dark:border-darkBorderInput">
                                                        <span className="px-3 pr-4 py-[5px] border-r">
                                                            {prefix}
                                                        </span>
                                                        <input
                                                            {...field}
                                                            type="tel"
                                                            maxLength={9}
                                                            className="bg-transparent outline-none border-none py-[5px] pl-2 w-[230px]"
                                                            placeholder="XX XXX XX XX"
                                                            onChange={(e) => {
                                                                const value =
                                                                    e.target.value.replace(
                                                                        /\D/g,
                                                                        ""
                                                                    );
                                                                field.onChange(
                                                                    value
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Choose Employee */}
                                <FormField
                                    control={form.control}
                                    name="employee_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="employee_id"
                                                className="text-gray-700 dark:text-white font-medium"
                                            >
                                                {t("employee")}
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
                                                                "chooseEmployee"
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {isLoading
                                                                ? t("loading")
                                                                : isError
                                                                ? "Error"
                                                                : employeesData
                                                                      ?.Data
                                                                      ?.employees
                                                                      ?.length ===
                                                                  0
                                                                ? t(
                                                                      "datasNotFound"
                                                                  )
                                                                : employeesData?.Data?.employees?.map(
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

                            <div className="flex flex-wrap gap-4">
                                {/* Region */}
                                <FormField
                                    control={form.control}
                                    name="region"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="employee_id"
                                                className="text-gray-700 dark:text-white font-medium"
                                            >
                                                {t("province")}
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    defaultValue={field.value}
                                                    onValueChange={(value) => {
                                                        setValues(
                                                            "region",
                                                            value,
                                                            {
                                                                shouldValidate: true,
                                                            }
                                                        );
                                                        setValues(
                                                            "district",
                                                            "",
                                                            {
                                                                shouldValidate: false,
                                                            }
                                                        );
                                                    }}
                                                    value={selectedProvince}
                                                >
                                                    <SelectTrigger
                                                        className="w-[300px] bg-white"
                                                        {...field}
                                                    >
                                                        <SelectValue
                                                            placeholder={t(
                                                                "enterProvince"
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {clientAddressData?.viloyatlar?.map(
                                                                (item) => (
                                                                    <SelectGroup
                                                                        key={
                                                                            item.id
                                                                        }
                                                                    >
                                                                        <SelectItem
                                                                            value={
                                                                                item.name
                                                                            }
                                                                        >
                                                                            {
                                                                                item.name
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

                                {/* District */}
                                <FormField
                                    control={form.control}
                                    name="district"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="employee_id"
                                                className="text-gray-700 dark:text-white font-medium"
                                            >
                                                {t("district")}
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    defaultValue={field.value}
                                                    onValueChange={(value) => {
                                                        setValues(
                                                            "district",
                                                            value,
                                                            {
                                                                shouldValidate: true,
                                                            }
                                                        );
                                                    }}
                                                    value={form.watch(
                                                        "district"
                                                    )}
                                                    disabled={!selectedProvince}
                                                >
                                                    <SelectTrigger
                                                        className="w-[300px] bg-white"
                                                        {...field}
                                                    >
                                                        <SelectValue
                                                            placeholder={t(
                                                                "enterDistrict"
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {selectedProvince &&
                                                                clientAddressData?.tumanlar[
                                                                    selectedProvince
                                                                ]?.map(
                                                                    (
                                                                        tuman,
                                                                        index
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                index
                                                                            }
                                                                            value={
                                                                                tuman
                                                                            }
                                                                        >
                                                                            {
                                                                                tuman
                                                                            }
                                                                        </SelectItem>
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

                                {/* Street */}
                                <FormField
                                    control={form.control}
                                    name="street"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="street"
                                                className="text-gray-700 dark:text-white font-medium"
                                            >
                                                {t("street")}*
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        "enterStreet"
                                                    )}
                                                    {...field}
                                                    className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                {/* passport_series */}
                                <FormField
                                    control={form.control}
                                    name="passport_series"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="passportSeries"
                                                className="text-gray-700 dark:text-white font-medium"
                                            >
                                                {t("passportSeries")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        "enterPassportSeries"
                                                    )}
                                                    {...field}
                                                    maxLength={9}
                                                    className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Choose Client for Referad_id */}
                                <FormField
                                    control={form.control}
                                    name="referred_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="referred_id"
                                                className="text-gray-700 dark:text-white font-medium"
                                            >
                                                {t("referred")}
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                    value={form.watch(
                                                        "referred_id"
                                                    )}
                                                >
                                                    <SelectTrigger
                                                        className="w-[300px] bg-white"
                                                        {...field}
                                                    >
                                                        <SelectValue
                                                            placeholder={t(
                                                                "chooseReferred"
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {clientsLoading
                                                                ? t("loading")
                                                                : clientsError
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

                                {/* passport_series */}
                                <FormField
                                    control={form.control}
                                    name="percent_for_employee_custom"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="percent_for_employee_custom"
                                                className="text-gray-700 dark:text-white font-medium"
                                            >
                                                {t("percentForEmployee")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        "enterPercentForEmployee"
                                                    )}
                                                    {...field}
                                                    className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <NavLink
                                    to={"/clients"}
                                    type="reset"
                                    className="w-[120px] text-center bg-red-500 text-white py-[6px] px-2 rounded-md transition-all duration-150 hover:bg-red-400"
                                >
                                    {t("cencel")}
                                </NavLink>
                                <Button type="submit" disabled={isMutating}>
                                    {isMutating ? <Spinner /> : t("submit")}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </TabsContent>

                <TabsContent value="yuridik">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmitLegal)}
                            className="space-y-8"
                        >
                            <div className="flex flex-wrap gap-4">
                                {/* Full Name */}
                                <FormField
                                    control={form.control}
                                    name="full_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="full_name"
                                                className="text-gray-700 dark:text-white font-medium"
                                            >
                                                {t("fullName")}*
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        "enterFullName"
                                                    )}
                                                    {...field}
                                                    className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Phone Number */}
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="phone"
                                                className="text-gray-700  dark:text-white font-medium"
                                            >
                                                {t("phoneNumber")}*
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <div className="flex bg-white w-[300px] items-center border-[1.6px] rounded-[8px] overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-within:border-primary dark:bg-darkBgInputs dark:border-darkBorderInput">
                                                        <span className="px-3 pr-4 py-[5px] border-r">
                                                            {prefix}
                                                        </span>
                                                        <input
                                                            {...field}
                                                            type="tel"
                                                            maxLength={9}
                                                            className="bg-transparent outline-none border-none py-[5px] pl-2 w-[230px]"
                                                            placeholder="XX XXX XX XX"
                                                            onChange={(e) => {
                                                                const value =
                                                                    e.target.value.replace(
                                                                        /\D/g,
                                                                        ""
                                                                    );
                                                                field.onChange(
                                                                    value
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Choose Employee */}
                                <FormField
                                    control={form.control}
                                    name="employee_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="employee_id"
                                                className="text-gray-700 dark:text-white font-medium"
                                            >
                                                {t("employee")}
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
                                                                "chooseEmployee"
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {isLoading
                                                                ? t("loading")
                                                                : isError
                                                                ? "Error"
                                                                : employeesData
                                                                      ?.Data
                                                                      ?.employees
                                                                      ?.length ===
                                                                  0
                                                                ? t(
                                                                      "datasNotFound"
                                                                  )
                                                                : employeesData?.Data?.employees?.map(
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

                            <div className="flex flex-wrap gap-4">
                                {/* Region */}
                                <FormField
                                    control={form.control}
                                    name="region"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="employee_id"
                                                className="text-gray-700 dark:text-white font-medium"
                                            >
                                                {t("province")}
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    defaultValue={field.value}
                                                    onValueChange={(value) => {
                                                        setValues(
                                                            "region",
                                                            value,
                                                            {
                                                                shouldValidate: true,
                                                            }
                                                        );
                                                        setValues(
                                                            "district",
                                                            "",
                                                            {
                                                                shouldValidate: false,
                                                            }
                                                        );
                                                    }}
                                                    value={selectedProvince}
                                                >
                                                    <SelectTrigger
                                                        className="w-[300px] bg-white"
                                                        {...field}
                                                    >
                                                        <SelectValue
                                                            placeholder={t(
                                                                "enterProvince"
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {clientAddressData?.viloyatlar?.map(
                                                                (item) => (
                                                                    <SelectGroup
                                                                        key={
                                                                            item.id
                                                                        }
                                                                    >
                                                                        <SelectItem
                                                                            value={
                                                                                item.name
                                                                            }
                                                                        >
                                                                            {
                                                                                item.name
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

                                {/* District */}
                                <FormField
                                    control={form.control}
                                    name="district"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="employee_id"
                                                className="text-gray-700 dark:text-white font-medium"
                                            >
                                                {t("district")}
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(value) => {
                                                        setValues(
                                                            "district",
                                                            value,
                                                            {
                                                                shouldValidate: true,
                                                            }
                                                        );
                                                    }}
                                                    defaultValue={field.value}
                                                    value={form.watch(
                                                        "district"
                                                    )}
                                                    disabled={!selectedProvince}
                                                >
                                                    <SelectTrigger
                                                        className="w-[300px] bg-white"
                                                        {...field}
                                                    >
                                                        <SelectValue
                                                            placeholder={t(
                                                                "enterDistrict"
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {selectedProvince &&
                                                                clientAddressData?.tumanlar[
                                                                    selectedProvince
                                                                ]?.map(
                                                                    (
                                                                        tuman,
                                                                        index
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                index
                                                                            }
                                                                            value={
                                                                                tuman
                                                                            }
                                                                        >
                                                                            {
                                                                                tuman
                                                                            }
                                                                        </SelectItem>
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

                                {/* Street */}
                                <FormField
                                    control={form.control}
                                    name="street"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="street"
                                                className="text-gray-700 dark:text-white font-medium"
                                            >
                                                {t("street")}*
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        "enterStreet"
                                                    )}
                                                    {...field}
                                                    className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                {/* passport_series */}
                                <FormField
                                    control={form.control}
                                    name="passport_series"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="passportSeries"
                                                className="text-gray-700 dark:text-white font-medium"
                                            >
                                                {t("passportSeries")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        "enterPassportSeries"
                                                    )}
                                                    {...field}
                                                    maxLength={9}
                                                    className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Choose Client for Referad_id */}
                                <FormField
                                    control={form.control}
                                    name="referred_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="referred_id"
                                                className="text-gray-700 dark:text-white font-medium"
                                            >
                                                {t("referred")}
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                    value={form.watch(
                                                        "referred_id"
                                                    )}
                                                >
                                                    <SelectTrigger
                                                        className="w-[300px] bg-white"
                                                        {...field}
                                                    >
                                                        <SelectValue
                                                            placeholder={t(
                                                                "chooseReferred"
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {clientsLoading
                                                                ? t("loading")
                                                                : clientsError
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

                                {/* is_company */}
                                <FormField
                                    control={form.control}
                                    name="is_company"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="is_company"
                                                className="text-gray-700 dark:text-white font-medium"
                                            >
                                                {t("isCompany")}
                                            </FormLabel>
                                            <FormControl>
                                                <Switch
                                                    className="block"
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                    id="is_company"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex flex-wrap gap-4">
                                {/* inn_number */}
                                <FormField
                                    control={form.control}
                                    name="inn_number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="inn_number"
                                                className="text-gray-700 dark:text-white font-medium"
                                            >
                                                {t("innNumber")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        "enterInnNumber"
                                                    )}
                                                    {...field}
                                                    className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* company_name */}
                                <FormField
                                    control={form.control}
                                    name="company_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="company_name"
                                                className="text-gray-700 dark:text-white font-medium"
                                            >
                                                {t("companyName")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        "enterCompanyName"
                                                    )}
                                                    {...field}
                                                    className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <NavLink
                                    to={"/clients"}
                                    type="reset"
                                    className="w-[120px] text-center bg-red-500 text-white py-[6px] px-2 rounded-md transition-all duration-150 hover:bg-red-400"
                                >
                                    {t("cencel")}
                                </NavLink>
                                <Button type="submit" disabled={isMutating}>
                                    {isMutating ? <Spinner /> : t("submit")}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </TabsContent>
            </Tabs>
        </div>
    );
}
