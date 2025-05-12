import { ImageUpload } from "@/components/component/Image-Upload";
import { Spinner } from "@/components/component/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clientAddressData } from "@/data/viloyatlar";
import { useMutateData } from "@/hook/useApi";
import { getBusinessClientById } from "@/service/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NavLink, useParams } from "react-router-dom";
import { z } from "zod";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronsUpDown } from "lucide-react";

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

export const LegalForm = () => {
  const { mutate, isLoading: isMutating } = useMutateData();
  const { t } = useTranslation();
  const prefix = "+998";
  const prefixServer = "998";
  const { id } = useParams();

  const { data: clientData } = useQuery({
    queryKey: ["client", id],
    queryFn: () => getBusinessClientById(id),
    enabled: !!id,
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
      company_name: "",
      account_number: "",
      info_number: "",
    },
  });

  useEffect(() => {
    if (clientData?.data && id) {
      const client = clientData?.data;
      //   const formatePhoneNumber = client.phone.splice(3);
      legalForm.reset({
        full_name: client.full_name,
        phone: client.phone,
        street: client.street,
        region: client.region,
        district: client.district,
        inn_number: client.inn_number,
        company_name: client.company_name,
        quarter: client.quarter,
        account_number: client.account_number,
        info_number: client.info_number,
      });
      //   if (client?.is_company) {
      //     selectedTab("yuridik");
      //   } else {
      //     selectedTab("jismoniy");
      //   }
    }
  }, [clientData, id, legalForm]);

  const selectedProvince = legalForm.watch("region");
  const setValues = legalForm.setValue;

  const onSubmitLegal = (data) => {
    const formData = new FormData();
    const {
      full_name,
      phone,
      street,
      region,
      district,
      inn_number,
      company_name,
      quarter,
      file,
    } = data;

    const fullPhoneNumber = `${prefixServer}${phone}`;
    formData.append("phone", fullPhoneNumber);
    formData.append("full_name", full_name);
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
      endpoint: "/client-business",
      method: "POST",
      data: formData,
      navigatePath: "/clients",
      toastCreateMessage: "clientCreated",
      mutateQueryKey: "/clients",
    });
  };

  return (
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
                          ? clientAddressData?.tumanlar[selectedProvince]?.find(
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
                          clientAddressData?.tumanlar[selectedProvince]?.map(
                            (district) => (
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
        </div>

        <div className="flex flex-wrap items-center gap-4">
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
                    // multiple={true}
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
  );
};
