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

const isValidUUID = (uuid) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuid && typeof uuid === "string" && uuidRegex.test(uuid);
};

const formSchema = z.object({
  count_of_product: z.string().min(1, {
    message: "firstNameRequired",
  }),
  total_price: z.string().min(1, {
    message: "cashBackRequired",
  }),
  product_id: z
    .string()
    .min(1, "Please select an employee")
    .refine((value) => isValidUUID(value), {
      message: "Invalid employee ID format",
    }),
  client_id: z
    .string()
    .min(1, "Please select an employee")
    .refine((value) => isValidUUID(value), {
      message: "Invalid employee ID format",
    }),
});

export default function CreateReport() {
  const { t } = useTranslation();
  const { mutate, isLoading: isMutating } = useMutateData();

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsIsError,
  } = useGetData({
    endpoint: "/products",
    enabled: true,
    getQueryKey: "/products",
  });

  console.log(productsData);

  // console.log(employeesData);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: "",
      count_of_product: "",
      product_id: "",
      total_price: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Client Submiot Data :", data);
    if (!isValidUUID(data.employee_id)) {
      return;
    }
    mutate({
      endpoint: "/trade",
      method: "POST",
      data: data,
      navigatePath: "/reports",
      toastCreateMessage: "reportCreated",
      mutateQueryKey: "/reports",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 pt-6">{t("createClient")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-wrap gap-4">
            {/* Choose Client */}
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="client"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("client")}
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[300px] bg-white" {...field}>
                        <SelectValue placeholder={t("enterProducts")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {productsLoading
                            ? t("loading")
                            : productsIsError
                            ? "Error"
                            : productsData?.Data?.products?.length === 0
                            ? t("datasNotFound")
                            : productsData?.Data?.products?.map((item) => (
                                <SelectGroup key={item.id}>
                                  <SelectItem value={item.id}>
                                    {item?.name}
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
            {/* Choose Product */}
            <FormField
              control={form.control}
              name="product_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="client"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("client")}
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[300px] bg-white" {...field}>
                        <SelectValue placeholder={t("enterProducts")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {productsLoading
                            ? t("loading")
                            : productsIsError
                            ? "Error"
                            : productsData?.Data?.products?.length === 0
                            ? t("datasNotFound")
                            : productsData?.Data?.products?.map((item) => (
                                <SelectGroup key={item.id}>
                                  <SelectItem value={item.id}>
                                    {item?.name}
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
            {/* count_of_product */}
            <FormField
              control={form.control}
              name="count_of_product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="referred_by"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("referredBy")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("enterReferredBy")}
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
            {/* total_price */}
            <FormField
              control={form.control}
              name="total_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="total_price"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("cashBack")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("enterCashBack") + "  %"}
                      {...field}
                      className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit">
            {isMutating ? <Spinner /> : t("submit")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
