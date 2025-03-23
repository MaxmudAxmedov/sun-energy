import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { useGetData } from "@/hook/useApi";
import { useMutateData } from "@/hook/useApi";
import { Spinner } from "@/components/component/spinner";

const formSchema = z.object({
  full_name: z.string().min(1, "fullNameRequired"),
  phone: z.string().min(1, "phoneNumberRequired"),
  position_id: z.string().min(1, "positionRequired"),
});

export default function CreateEmployee() {
  const { t } = useTranslation();
  const prefix = "+998";
  const prefixForServer = "998";
  const { data, isLoading, isError } = useGetData({
    endpoint: "/positions",
    enabled: true,
    getQueryKey: "/positions",
  });
  console.log(data);
  const { mutate, isLoading: muatateLoading } = useMutateData();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      position_id: "",
    },
  });
  const onSubmit = (data) => {
    const newData = {
      ...data,
      phone: prefixForServer + data.phone,
    };
    mutate({
      endpoint: "/employee",
      data: newData,
      toastCreateMessage: "employeeCreated",
      navigatePath: "/employee",
      mutateQueryKey: "/employees",
    });
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 pt-6">{t("createEmployee")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Second Name */}
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
                    <div className="flex bg-white max-w-[300px] items-center border-[1.6px] rounded-[8px] overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-within:border-primary dark:bg-darkBgInputs dark:border-darkBorderInput">
                      <span className="px-3 pr-4 py-[5px] border-r">
                        {prefix}
                      </span>
                      <input
                        {...field}
                        type="tel"
                        maxLength={9}
                        className="bg-transparent outline-none border-none py-[5px] pl-2 w-[233px]"
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

          {/* Choose Position ID */}
          <FormField
            control={form.control}
            name="position_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="position_id"
                  className="text-gray-700 dark:text-white font-medium"
                >
                  {t("position")}*
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[300px]" {...field}>
                      <SelectValue placeholder={t("choosePosition")} />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading
                        ? t("loading")
                        : isError
                        ? "Error"
                        : data?.Data?.positions?.length === 0
                        ? t("datasNotFound")
                        : data?.Data?.positions?.map((item) => (
                            <SelectGroup key={item.id}>
                              <SelectItem value={item.id}>
                                {item.name}
                              </SelectItem>
                            </SelectGroup>
                          ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-4">
            {muatateLoading ? <Spinner /> : t("submit")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
