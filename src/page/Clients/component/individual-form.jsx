import React, { useEffect } from "react";
import { useMutateData } from "@/hook/useApi";
import { useTranslation } from "react-i18next";
import { NavLink, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getClientById } from "@/service/client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { clientAddressData } from "@/data/viloyatlar";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/component/Image-Upload";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/component/spinner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SingleImageUpload } from "@/components/component/SingleUpload";
const individualFormSchema = z.object({
  first_name: z.string().min(1, {
    message: "firstNameRequired",
  }),
  last_name: z.string().min(1, {
    message: "lastNameRequired",
  }),
  patronymic: z.string().min(1, {
    message: "patronymicRequired",
  }),
  street: z.string().min(1, {
    message: "streetRequired",
  }),
  region: z.string().min(1, {
    message: "provinceRequired",
  }),
  district: z.string().min(1, {
    message: "districtRequired",
  }),
  quarter: z.string().min(1, {
    message: "quarterRequired",
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
  file: z.custom(
    (value) => {
      if (!value) return false;
      if (value instanceof File) {
        const maxSize = 5 * 1024 * 1024;
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/webp",
        ];
        return value.size <= maxSize && allowedTypes.includes(value.type);
      }
      if (typeof value === "string") {
        return true;
      }

      return false;
    },
    {
      message:
        "Image must be JPG, JPEG or PNG or WEBP format and less than 5MB",
    }
  ),
});

export const IndividualForm = () => {
  //   const [viewingImage, setViewingImage] = React.useState(null);
  //   const [images, setImages] = React.useState([]);
  const { id } = useParams();
  const { mutate, isLoading: isMutating } = useMutateData();

  const { data: clientData } = useQuery({
    queryKey: ["client", id],
    queryFn: () => getClientById(id),
    enabled: !!id,
  });

  const { t } = useTranslation();

  const prefix = "+998";
  const prefixServer = "998";

  const idividualForm = useForm({
    resolver: zodResolver(individualFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      patronymic: "",
      phone: "",
      street: "",
      region: "",
      district: "",
      quarter: "",
      passport_series: "",
      file: "",
    },
  });

  useEffect(() => {
    if (clientData?.data && id) {
      const client = clientData?.data;
      const formatePhoneNumber = client.phone.slice(3);
      idividualForm.setValue("first_name", client.first_name);
      idividualForm.setValue("last_name", client.last_name);
      idividualForm.setValue("patronymic", client.patronymic);
      idividualForm.setValue("phone", formatePhoneNumber);
      idividualForm.setValue("street", client.street);
      idividualForm.setValue("region", client.region);
      idividualForm.setValue("district", client.district);
      idividualForm.setValue("quarter", client.quarter);
      idividualForm.setValue("passport_series", client.passport_series);
      idividualForm.setValue("file", client.file);
    }
  }, [clientData, idividualForm, id]);

  const selectedProvince = idividualForm.watch("region");
  const setValues = idividualForm.setValue;

  //   const handleDeleteImage = (index) => {
  //     const newImages = [...images];
  //     newImages[index];
  //     newImages.splice(index, 1);
  //     setImages(newImages);
  //     onchange(newImages.map((img) => img.file || img.photo));
  //   };

  //   const openImageViewer = (imageUrl) => {
  //     setViewingImage(imageUrl);
  //   };

  //   const closeImageViewer = () => {
  //     setViewingImage(null);
  //   };

  const onSubmitIndividual = (data) => {
    const formData = new FormData();
    const {
      first_name,
      last_name,
      patronymic,
      phone,
      street,
      region,
      district,
      passport_series,
      file,
      quarter,
    } = data;

    const fullPhoneNumber = `${prefixServer}${phone}`;
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("patronymic", patronymic);
    formData.append("phone", fullPhoneNumber);
    formData.append("passport_series", passport_series);
    formData.append("street", street);
    formData.append("region", region);
    formData.append("district", district);
    formData.append("quarter", quarter);
    formData.append("file", file);

    mutate({
      endpoint: "/client-customer",
      method: "POST",
      data: formData,
      navigatePath: "/clients",
      toastCreateMessage: "clientCreated",
      mutateQueryKey: "/clients",
    });
  };

  return (
    <FormProvider {...idividualForm}>
      <form
        onSubmit={idividualForm.handleSubmit(onSubmitIndividual)}
        className="space-y-6"
      >
        <div className="flex flex-wrap gap-4">
          {/* First Name */}
          <FormField
            control={idividualForm.control}
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
            control={idividualForm.control}
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
            control={idividualForm.control}
            name="patronymic"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="patronymic"
                  className="text-gray-700 dark:text-white font-medium"
                >
                  {t("patronymic")}*
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("enterPatronymic")}
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
          {/* Region */}
          <FormField
            control={idividualForm.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="regiiio"
                  className="text-gray-700 dark:text-white font-medium"
                >
                  {t("province")}
                </FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={(value) => {
                      setValues("region", value, {
                        shouldValidate: true,
                      });
                      setValues("district", "", {
                        shouldValidate: false,
                      });
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
            control={idividualForm.control}
            name="district"
            render={({ field }) => (
              <FormItem className="flex flex-col mt-2.5">
                <FormLabel
                  htmlFor="district"
                  className="text-gray-700 dark:text-white font-medium"
                >
                  {t("district")}*
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[300px] justify-between bg-white dark:bg-darkBgInputs dark:border-darkBorderInput",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={!selectedProvince}
                      >
                        {field.value
                          ? clientAddressData?.tumanlar[selectedProvince]?.find(
                              (district) => district === field.value
                            )
                          : t("enterDistrict")}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0 ">
                    <Command>
                      <CommandInput placeholder={t("searchDistrict")} />
                      <CommandEmpty>{t("noDistrictFound")}</CommandEmpty>
                      <CommandGroup className="max-h-[340px] overflow-y-auto">
                        {selectedProvince &&
                          clientAddressData?.tumanlar[selectedProvince]?.map(
                            (district) => (
                              <CommandItem
                                key={district}
                                value={district}
                                onSelect={() => {
                                  idividualForm.setValue("district", district, {
                                    shouldValidate: true,
                                  });
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === district
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {district}
                              </CommandItem>
                            )
                          )}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mahalla */}
          <FormField
            control={idividualForm.control}
            name="quarter"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="quarter"
                  className="text-gray-700 dark:text-white font-medium"
                >
                  {t("quarter")}
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

        <div className="flex items-center flex-wrap gap-x-4">
          {/* Street */}
          <FormField
            control={idividualForm.control}
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

          {/* Phone Number */}
          <FormField
            control={idividualForm.control}
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
          {/* passport_series */}
          <FormField
            control={idividualForm.control}
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

        {/* Image Uploade */}
        <FormField
          control={idividualForm.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor="photos"
                className="text-gray-700 dark:text-white font-medium"
              >
                {t("image")}*
              </FormLabel>
              <FormControl>
                {/* <ImageUpload onChange={(files) => field.onChange(files)} /> */}
                <SingleImageUpload
                  defaultImage={id ? clientData?.data?.file : ""}
                  onChange={(file) => {
                    field.onChange(file);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* {id && (
          <div className="flex gap-2 mt-2">
            <div className="relative h-[100px] group w-32 desktop:hover:opacity-80 transition-all duration-300">
              <div
                className="w-32 h-[100px] border border-dashed rounded-md overflow-hidden cursor-pointer"
                onClick={() => openImageViewer(clientData?.data?.file)}
              >
                <img
                  src={clientData?.data?.file || "/placeholder.svg"}
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
        )} */}
        {/* Image viewer modal */}
        {/* {viewingImage && (
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
        )} */}

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
    </FormProvider>
  );
};
