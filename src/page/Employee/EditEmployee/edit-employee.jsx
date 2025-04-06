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
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { useGetData } from "@/hook/useApi";
import { useMutateData } from "@/hook/useApi";
import { Spinner } from "@/components/component/spinner";
import { useNavigate, useParams } from "react-router-dom";
import { clientAddressData } from "@/data/viloyatlar";
import { ImageUpload } from "@/components/component/Image-Upload";
import { Trash2, X } from "lucide-react";

const formSchema = z.object({
  full_name: z.string().min(1, "fullNameRequired"),
  phone: z.string().min(1, "phoneNumberRequired"),
  position_id: z.string().min(1, "positionRequired"),
  photo: z
    .custom(
      (value) => {
        if (Array.isArray(value)) {
          return value.every((file) => file instanceof File);
        }
        return false;
      },
      {
        message: "Image must be JPG, JPEG or PNG format and less than 5MB",
      }
    )
    .refine((files) => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      return files.every((file) => file.size <= maxSize);
    }, "Image size must be less than 5MB"),
});

export default function EditEmployee() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [viewingImage, setViewingImage] = useState(null);
  const [images, setImages] = useState([]);
  const prefix = "+998";
  const prefixForServer = "998";

  const {
    data: positions,
    isLoading: isPositionLoading,
    isError: isPositionError,
  } = useGetData({
    endpoint: "/positions",
    enabled: true,
    getQueryKey: "/positions",
  });

  // const positionMapData = positions?.Data?.positions?.map((item) => ({
  //   value: item.id,
  //   label: item.name,
  // }));

  const { data: employee, isLoading: employeeLoading } = useGetData({
    endpoint: `/employee/${id}`,
    enabled: !!id,
    getQueryKey: "/employees",
  });

  console.log("employee", employee);

  const { mutate, isLoading: mutateLoading } = useMutateData();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      position_id: "",
      photo: null,
    },
  });

  useEffect(() => {
    if (employee) {
      const {
        first_name,
        last_name,
        passport_series,
        patronymic,
        address,
        phone,
        position_id,
      } = employee;
      form.reset({
        first_name,
        last_name,
        address,
        patronymic,
        passport_series,
        phone: phone.replace(prefixForServer, ""),
        position_id: position_id?.toString() || "",
      });
    }
  }, [employee, form]);

  const selectedProvince = form.watch("viloyat");
  const setValues = form.setValue;

  const handleDeleteImage = (index) => {
    const newImages = [...images];
    newImages[index];
    newImages.splice(index, 1);
    setImages(newImages);
    onchange(newImages.map((img) => img.file));
  };

  const openImageViewer = (imageUrl) => {
    setViewingImage(imageUrl);
  };

  const closeImageViewer = () => {
    setViewingImage(null);
  };

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
                        {isPositionLoading
                          ? t("loading")
                          : isPositionError
                          ? "Error"
                          : positions?.Data?.positions?.length === 0
                          ? t("datasNotFound")
                          : positions?.Data?.positions?.map((item) => (
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
              name="viloyat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="viloyat"
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
                    htmlFor="tuman"
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
                    htmlFor="address"
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
          <div>
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

            <div className="flex gap-2 mt-2">
              <div className="relative h-[100px] group w-32 desktop:hover:opacity-80 transition-all duration-300">
                <div
                  className="w-32 h-[100px] border border-dashed rounded-md overflow-hidden cursor-pointer"
                  onClick={() => openImageViewer(employee?.photo)}
                >
                  <img
                    src={employee?.photo || "/placeholder.svg"}
                    alt={`Uploaded image`}
                    width={100}
                    height={60}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 desktop:opacity-0 desktop:group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(1);
                    setImages((prev) => prev.filter((_, index) => index !== 0));
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            {/* Image viewer modal */}
            {viewingImage && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="relative max-w-4xl max-h-[90vh] w-full">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-[-30px] right-[-100px] z-10"
                    onClick={closeImageViewer}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="p-2 rounded-lg overflow-hidden">
                    <img
                      src={viewingImage || "/placeholder.svg"}
                      alt="Enlarged image"
                      width={1200}
                      height={800}
                      className="max-h-[80vh] rounded-lg mx-w-[1400px] mx-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
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
