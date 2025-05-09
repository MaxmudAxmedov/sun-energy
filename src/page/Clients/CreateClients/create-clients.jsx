import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
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
import { useMutateData } from "@/hook/useApi";
import { Spinner } from "@/components/component/spinner";
import { clientAddressData } from "@/data/viloyatlar";
import { NavLink, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getClientById } from "@/service/client";
import { useQuery } from "@tanstack/react-query";
import { ImageUpload } from "@/components/component/Image-Upload";
import { Trash2, X, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { z } from "zod";

// const isValidUUID = (uuid) => {
//   const uuidRegex =
//     /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
//   return uuid && typeof uuid === "string" && uuidRegex.test(uuid);
// };

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
});

const legalFormSchema = z.object({
  full_name: z.string().min(1, {
    message: "firstNameRequired",
  }),
  street: z.string().min(1, {
    message: "streetRequired",
  }),
  region: z.string().optional(),
  district: z.string().min(1, {
    message: "districtRequired",
  }),
  quarter: z.string().min(1, {
    message: "quarterRequired",
  }),
  inn_number: z.string().optional(),
  company_name: z.string().optional(),
  account_number: z.string().min(1, {
    message: "accountNumberRequired",
  }),
  info_number: z
    .string()
    .min(1, {
      message: "infoNumberRequired",
    })
    .max(5, {
      message: "infoNumberInvalid",
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
});

export default function CreateClients() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { mutate, isLoading: isMutating } = useMutateData();
  const [images, setImages] = useState([]);
  const [viewingImage, setViewingImage] = useState(null);
  const prefix = "+998";
  const prefixServer = "998";
  const [selectedTab, setSelectedTab] = useState("jismoniy");

  const { data: clientData } = useQuery({
    queryKey: ["client", id],
    queryFn: () => getClientById(id),
    enabled: !!id,
  });

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
      file: null,
    },
  });
  const legalForm = useForm({
    resolver: zodResolver(legalFormSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      street: "",
      region: "",
      district: "",
      quarter: "",
      inn_number: "",
      file: null,
      company_name: "",
      account_number: "",
      info_number: "",
    },
  });

  useEffect(() => {
    if (clientData && id) {
      const client = clientData?.data;
      const formatePhoneNumber = client.phone.slice(3);
      idividualForm.reset({
        first_name: client.first_name,
        last_name: client.last_name,
        patronymic: client.patronymic,
        phone: formatePhoneNumber,
        street: client.street,
        region: client.region,
        district: client.district,
        passport_series: client.passport_series,
        quarter: client.quarter,
      });

      legalForm.reset({
        full_name: client.full_name,
        phone: formatePhoneNumber,
        street: client.street,
        region: client.region,
        district: client.district,
        inn_number: client.inn_number,
        company_name: client.company_name,
        quarter: client.quarter,
        account_number: client.account_number,
        info_number: client.info_number,
      });

      if (client?.is_company) {
        setSelectedTab("yuridik");
      } else {
        setSelectedTab("jismoniy");
      }
    }
  }, [clientData, id, idividualForm, legalForm]);

  const selectedProvince =
    idividualForm.watch("region") || legalForm.watch("region");
  const setValues = idividualForm.setValue || legalForm.setValue;

  const handleDeleteImage = (index) => {
    const newImages = [...images];
    newImages[index];
    newImages.splice(index, 1);
    setImages(newImages);
    onchange(newImages.map((img) => img.file || img.photo));
  };

  const openImageViewer = (imageUrl) => {
    setViewingImage(imageUrl);
  };

  const closeImageViewer = () => {
    setViewingImage(null);
  };

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
      is_company,
      inn_number,
      company_name,
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
    {
      is_company && formData.append("is_company", is_company);
    }
    {
      inn_number && formData.append("inn_number", inn_number);
    }
    {
      company_name && formData.append("company_name", company_name);
    }
    formData.append("quarter", quarter);
    for (let i = 0; i < file?.length; i++) {
      formData.append("file", file[i]);
    }

    mutate({
      endpoint: "/client",
      method: "POST",
      data: formData,
      navigatePath: "/clients",
      toastCreateMessage: "clientCreated",
      mutateQueryKey: "/clients",
    });
  };

  const onSubmitLegal = (data) => {
    const formData = new FormData();
    const {
      full_name,
      phone,
      street,
      region,
      district,
      passport_series,
      inn_number,
      company_name,
      quarter,
      file,
    } = data;

    const fullPhoneNumber = `${prefixServer}${phone}`;
    formData.append("phone", fullPhoneNumber);
    formData.append("full_name", full_name);
    formData.append("passport_series", passport_series);
    formData.append("street", street);
    formData.append("region", region);
    formData.append("district", district);
    formData.append("is_company", true);
    formData.append("inn_number", inn_number);
    formData.append("company_name", company_name);
    formData.append("quarter", quarter);
    formData.append("account_number", data.account_number);
    formData.append("info_number", data.info_number);
    for (let i = 0; i < file?.length; i++) {
      formData.append("file", file[i]);
    }

    mutate({
      endpoint: "/client-company",
      method: "POST",
      data: formData,
      navigatePath: "/clients",
      toastCreateMessage: "clientCreated",
      mutateQueryKey: "/clients",
    });
  };

  return (
    <div className="tablet:h-screen">
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
                          <SelectTrigger
                            className="w-[300px] bg-white"
                            {...field}
                          >
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
                                ? clientAddressData?.tumanlar[
                                    selectedProvince
                                  ]?.find(
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
                                clientAddressData?.tumanlar[
                                  selectedProvince
                                ]?.map((district) => (
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
                                ))}
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

              <div className="flex items-center gap-x-4">
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
                      <ImageUpload
                        onChange={(files) => field.onChange(files)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {id && (
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
                        setImages((prev) =>
                          prev.filter((_, index) => index !== 0)
                        );
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
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
        </TabsContent>

        <TabsContent value="yuridik">
          <FormProvider {...legalForm}>
            <form
              onSubmit={legalForm.handleSubmit(onSubmitLegal)}
              className="space-y-6"
            >
              <div className="flex flex-wrap gap-4">
                {/* Director Name */}
                <FormField
                  control={legalForm.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="full_name"
                        className="text-gray-700 dark:text-white font-medium"
                      >
                        {t("directorName")}*
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
                  control={legalForm.control}
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
                  control={legalForm.control}
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

              <div className="flex flex-wrap gap-4">
                {/* Region */}
                <FormField
                  control={legalForm.control}
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
                            setValues("region", value, {
                              shouldValidate: true,
                            });
                            setValues("district", "", {
                              shouldValidate: false,
                            });
                          }}
                          value={selectedProvince}
                        >
                          <SelectTrigger
                            className="w-[300px] bg-white"
                            {...field}
                          >
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
                  control={legalForm.control}
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
                                ? clientAddressData?.tumanlar[
                                    selectedProvince
                                  ]?.find(
                                    (district) => district === field.value
                                  )
                                : t("enterDistrict")}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder={t("searchDistrict")} />
                            <CommandEmpty>{t("noDistrictFound")}</CommandEmpty>
                            <CommandGroup className="max-h-[340px] overflow-y-auto">
                              {selectedProvince &&
                                clientAddressData?.tumanlar[
                                  selectedProvince
                                ]?.map((district) => (
                                  <CommandItem
                                    key={district}
                                    value={district}
                                    onSelect={() => {
                                      legalForm.setValue("district", district, {
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
                                ))}
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
                  control={legalForm.control}
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

              <div className="flex flex-wrap items-center gap-4">
                {/* Street */}
                <FormField
                  control={legalForm.control}
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

                {/* company_name */}
                <FormField
                  control={legalForm.control}
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
                          placeholder={t("enterCompanyName")}
                          {...field}
                          className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* inn_number */}
                <FormField
                  control={legalForm.control}
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
                          maxLength={9}
                          placeholder={t("enterInnNumber")}
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
                {/* account_number */}
                <FormField
                  control={legalForm.control}
                  name="account_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="account_number"
                        className="text-gray-700 dark:text-white font-medium"
                      >
                        {t("accountNumber")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("enterAccountNumber")}
                          {...field}
                          className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* info_number */}
                <FormField
                  control={legalForm.control}
                  name="info_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="info_number"
                        className="text-gray-700 dark:text-white font-medium"
                      >
                        {t("infoNumber")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          maxLength={5}
                          placeholder={t("enterInfoNumber")}
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
                  control={legalForm.control}
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
                        <ImageUpload
                          onChange={(files) => field.onChange(files)}
                          multiple={true}
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
          </FormProvider>
        </TabsContent>
      </Tabs>
    </div>
  );
}

{
  /*
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
            placeholder={t("enterPercentForEmployee")}
            {...field}
            className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  
  */
}
