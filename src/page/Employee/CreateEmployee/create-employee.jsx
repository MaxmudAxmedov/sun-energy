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
// import { useGetData } from "@/hook/useApi";
import { useMutateData } from "@/hook/useApi";
import { Spinner } from "@/components/component/spinner";
import { clientAddressData } from "@/data/viloyatlar";
import { ImageUpload } from "@/components/component/Image-Upload";
import { NavLink } from "react-router-dom";

const formSchema = z.object({
  first_name: z.string().min(1, "fullNameRequired"),
  last_name: z.string().min(1, "fullNameRequired"),
  patronymic: z.string().min(1, "fullNameRequired"),
  phone: z.string().min(1, "phoneNumberRequired"),
  position_id: z.string().min(1, "positionRequired"),
  quarter: z.string().min(1, {
    message: "quarterRequired",
  }),
  region: z.string().min(1, {
    message: "provinceRequired",
  }),
  district: z.string().min(1, {
    message: "districtRequired",
  }),
  street: z.string().min(1, {
    message: "streetRequired",
  }),
  photo: z
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
  // const { data, isLoading, isError } = useGetData({
  //   endpoint: "/positions",
  //   enabled: true,
  //   getQueryKey: "/positions",
  // });

  const positionCustonmData = [
    {
      id: 1,
      name: "leader",
    },
    {
      id: 2,
      name: "admin",
    },
    {
      id: 3,
      name: "master",
    },
    {
      id: 4,
      name: "attractor",
    },
  ];

  const { mutate, isLoading: muatateLoading } = useMutateData();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      patronymic: "",
      phone: "",
      position_id: "",
      passport_series: "",
      region: "",
      district: "",
      street: "",
      quarter: "",
      photo: [],
    },
  });

  const selectedProvince = form.watch("region");
  const setValues = form.setValue;

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    const formData = new FormData();

    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("patronymic", data.patronymic);
    formData.append("phone", `${prefixForServer}${data.phone}`);
    formData.append("position_id", data.position_id);
    formData.append("passport_series", data.passport_series);
    formData.append("region", data.region);
    formData.append("district", data.district);
    formData.append("street", data.street);
    formData.append("quarter", data.quarter);

    for (let i = 0; i < data.photo.length; i++) {
      formData.append("photo", data.photo[i]);
    }

    mutate({
      endpoint: "/employee",
      data: formData,
      toastCreateMessage: "employeeCreated",
      navigatePath: "/employee",
      mutateQueryKey: "/employees",
    });
  };
  return (
    <div className="tablet:h-screen">
      <h1 className="text-2xl font-bold mb-8 pt-6">{t("createEmployee")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center flex-wrap gap-x-3">
            {/* First Name */}
            <FormField
              control={form.control}
              name="first_name"
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
            {/* Last Name */}
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="last_name"
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

            {/* Patronymic */}
            <FormField
              control={form.control}
              name="patronymic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="patronymic"
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

          <div className="flex items-center flex-wrap gap-x-3">
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
                    {t("passportSeries")}*
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
                        {positionCustonmData?.length === 0
                          ? t("datasNotFound")
                          : positionCustonmData?.map((item) => (
                              <SelectGroup key={item.id}>
                                <SelectItem value={item.id}>
                                  {t(item.name)}
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
            {/* Region */}
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="region"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("province")}*
                  </FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={(value) => {
                        setValues("region", value, {
                          shouldValidate: true,
                        });
                        setValues("district", "", { shouldValidate: false });
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

            {/* District */}
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="district"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("district")}*
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        setValues("district", value, { shouldValidate: true });
                      }}
                      defaultValue={field.value}
                      value={form.watch("district")}
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

            {/* Quarter */}
            <FormField
              control={form.control}
              name="quarter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="quarter"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("quarter")}*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("enterQuarter")}
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
            {/* Street  */}
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
                      placeholder={t("enterStreet")}
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
          <div className="flex items-center gap-x-4">
            <NavLink
              to={"/employee"}
              type="reset"
              className="w-[120px] text-center bg-red-500 text-white py-[6px] px-2 rounded-md transition-all duration-150 hover:bg-red-400"
            >
              {t("cencel")}
            </NavLink>

            <Button type="submit">
              {muatateLoading ? <Spinner /> : t("submit")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
