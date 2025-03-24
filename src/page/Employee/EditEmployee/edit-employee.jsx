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
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { useGetData } from "@/hook/useApi";
import { useMutateData } from "@/hook/useApi";
import { Spinner } from "@/components/component/spinner";
import { useNavigate, useParams } from "react-router-dom";

const formSchema = z.object({
  full_name: z.string().min(1, "fullNameRequired"),
  phone: z.string().min(1, "phoneNumberRequired"),
  position_id: z.string().min(1, "positionRequired"),
});

export default function EditEmployee() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const prefix = "+998";
  const prefixForServer = "998";

  const { data: positions } = useGetData({
    endpoint: "/positions",
    enabled: true,
    getQueryKey: "/positions",
  });

  const positionMapData = positions?.Data?.positions?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const { data: employee, isLoading: employeeLoading } = useGetData({
    endpoint: `/employee/${id}`,
    enabled: !!id,
    getQueryKey: "/employees",
  });

  const { mutate, isLoading: mutateLoading } = useMutateData();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      position_id: "",
    },
  });

  useEffect(() => {
    if (employee) {
      const { full_name, phone, position_id } = employee;
      form.reset({
        full_name,
        phone: phone.replace(prefixForServer, ""),
        position_id: position_id?.toString() || "",
      });
    }
  }, [employee, form]);

  const onSubmit = (data) => {
    const newData = {
      ...data,
      phone: prefixForServer + data.phone,
      id: employee.id,
    };
    mutate({
      endpoint: `/employee`,
      method: "PUT",
      data: newData,
      toastCreateMessage: "employeeUpdated",
      navigatePath: "/employee",
      mutateQueryKey: "/employees",
    });
  };

  if (employeeLoading) return <div>{t("loading")}...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 pt-6">{t("editEmployee")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="phone"
                  className="text-gray-700 dark:text-white font-medium"
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
                    <SelectTrigger className="w-[300px]">
                      <SelectValue placeholder={t("choosePosition")} />
                    </SelectTrigger>
                    <SelectContent>
                      {positionMapData?.map((item) => (
                        <SelectGroup key={item.value}>
                          <SelectItem value={item.value.toString()}>
                            {item.label}
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
          <div className="flex gap-4">
            <Button type="submit">
              {mutateLoading ? <Spinner /> : t("submit")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/employee")}
            >
              {t("cancel")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
