import React from "react";
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
import { NavLink } from "react-router-dom";

const isValidUUID = (uuid) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuid && typeof uuid === "string" && uuidRegex.test(uuid);
};

const formSchema = z.object({
  full_name: z.string().min(1, {
    message: "firstNameRequired",
  }),
  address: z.string().min(1, {
    message: "addressRequired",
  }),
  viloyat: z.string().min(1, {
    message: "provinceRequired",
  }),
  tuman: z.string().min(1, {
    message: "districtRequired",
  }),
  employee_id: z
    .string()
    .min(1, "Please select an employee")
    .refine((value) => isValidUUID(value), {
      message: "Invalid employee ID format",
    }),
  phone: z
    .string()
    .min(9, {
      message: "phoneNumberRequired",
    })
    .max(9, {
      message: "phoneNumberInvalid",
    })
    .refine((value) => /^\d{9}$/.test(value), {
      message: "phoneNumberRequired",
    }),
  passport_series: z
    .string()
    .min(1, { message: "Pasport seriyasi kiritilishi shart" })
    .regex(/^[A-Z]{2}\d{7}$/, {
      message: "Pasport seriyasi AA1234567 formatida bo‘lishi kerak",
    }),
});

export default function CreateClients() {
  const { t } = useTranslation();
  const { mutate, isLoading: isMutating } = useMutateData();
  const prefix = "+998";
  const prefixServer = "998";

  const {
    data: employeesData,
    isLoading,
    isError,
  } = useGetData({
    endpoint: "/employees",
    enabled: true,
    getQueryKey: "/employees",
  });

  // console.log(employeesData);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      employee_id: "",
      address: "",
      viloyatlar: "",
      tuman: "",
      passport_series: "",
    },
  });

  const selectedProvince = form.watch("viloyat");
  const setValues = form.setValue;

  const onSubmit = (data) => {
    if (!isValidUUID(data.employee_id)) {
      return;
    }

    const {
      full_name,
      phone,
      employee_id,
      address,
      viloyat,
      tuman,
      passport_series,
    } = data;

    const residential_address = `${viloyat} ${tuman} ${address}`;

    const fullPhoneNumber = `${prefixServer}${phone}`;
    const finalData = {
      phone: fullPhoneNumber,
      full_name,
      employee_id,
      passport_series,
      residential_address,
    };
    console.log(finalData);
    mutate({
      endpoint: "/client",
      method: "POST",
      data: finalData,
      navigatePath: "/clients",
      toastCreateMessage: "clientCreated",
      mutateQueryKey: "/clients",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 pt-6">{t("createClient")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      placeholder={t("enterFullName")}
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
                            const value = e.target.value.replace(/\D/g, "");
                            field.onChange(value);
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
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[300px] bg-white" {...field}>
                        <SelectValue placeholder={t("chooseEmployee")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {isLoading
                            ? t("loading")
                            : isError
                            ? "Error"
                            : employeesData?.Data?.employees?.length === 0
                            ? t("datasNotFound")
                            : employeesData?.Data?.employees?.map((item) => (
                                <SelectGroup key={item.id}>
                                  <SelectItem value={item.id}>
                                    {item?.first_name}
                                  </SelectItem>
                                </SelectGroup>
                              ))}
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
            {/* Viloyat */}
            <FormField
              control={form.control}
              name="viloyatlar"
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
                        setValues("viloyat", value, {
                          shouldValidate: true,
                        });
                        setValues("tuman", "", { shouldValidate: false });
                      }}
                      value={selectedProvince}
                    >
                      <SelectTrigger className="w-[300px] bg-white" {...field}>
                        <SelectValue placeholder={t("enterProvince")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {clientAddressData?.viloyatlar?.map((item) => (
                            <SelectGroup key={item.id}>
                              <SelectItem value={item.name}>
                                {item.name}
                              </SelectItem>
                            </SelectGroup>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tuman */}
            <FormField
              control={form.control}
              name="tuman"
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
                        setValues("tuman", value, { shouldValidate: true });
                      }}
                      defaultValue={field.value}
                      value={form.watch("tuman")}
                      disabled={!selectedProvince}
                    >
                      <SelectTrigger className="w-[300px] bg-white" {...field}>
                        <SelectValue placeholder={t("enterDistrict")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {selectedProvince &&
                            clientAddressData?.tumanlar[selectedProvince]?.map(
                              (tuman, index) => (
                                <SelectItem key={index} value={tuman}>
                                  {tuman}
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

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="full_name"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("address")}*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("enterAddress")}
                      {...field}
                      className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-wrap gap-4">
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
                      placeholder={t("enterPassportSeries")}
                      {...field}
                      maxLength={9}
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
            <Button type="submit">
              {isMutating ? <Spinner /> : t("submit")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
