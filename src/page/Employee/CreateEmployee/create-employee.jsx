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
import { clientAddressData } from "@/data/viloyatlar";
import { ImageUpload } from "@/components/component/Image-Upload";

const formSchema = z.object({
  name: z.string().min(1, "fullNameRequired"),
  secondName: z.string().min(1, "fullNameRequired"),
  lastName: z.string().min(1, "fullNameRequired"),
  phone: z.string().min(1, "phoneNumberRequired"),
  position_id: z.string().min(1, "positionRequired"),
  viloyat: z.string().min(1, {
    message: "provinceRequired",
  }),
  tuman: z.string().min(1, {
    message: "districtRequired",
  }),
  address: z.string().min(1, {
    message: "addressRequired",
  }),
  photos: z
    .custom(
      (file) => {
        if (!(file instanceof File)) return false;
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (file.size > maxSize) return false;
        if (!allowedTypes.includes(file.type)) return false;
        return true;
      },
      {
        message: "Image must be JPG, JPEG or PNG format and less than 5MB",
      }
    )
    .array()
    .min(1, "imageRequired"),
  passport_series: z
    .string()
    .min(1, { message: "Pasport seriyasi kiritilishi shart" })
    .regex(/^[A-Z]{2}\d{7}$/, {
      message: "Pasport seriyasi AA1234567 formatida bo‘lishi kerak",
    }),
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
      name: "",
      secondName: "",
      lastName: "",
      phone: "",
      position_id: "",
      passport_series: "",
      viloyat: "",
      tuman: "",
    },
  });

  const selectedProvince = form.watch("viloyat");
  const setValues = form.setValue;

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
          <div className="flex items-center gap-x-3">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="name"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("name")}*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("enterName")}
                      {...field}
                      className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Second Name */}
            <FormField
              control={form.control}
              name="second_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="name"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("secondName")}*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("enterSecondName")}
                      {...field}
                      className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="name"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("lastName")}*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("enterLastName")}
                      {...field}
                      className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center gap-x-3">
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

          {/* Image Uploade */}
          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="photos"
                  className="text-gray-700 dark:text-white font-medium"
                >
                  {t("image")}*
                </FormLabel>
                <FormControl>
                  <ImageUpload onChange={(files) => field.onChange(files)} />
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
