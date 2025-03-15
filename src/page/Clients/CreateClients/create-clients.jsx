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
import dayjs from "dayjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

const formSchema = z.object({
  firstName: z.string().min(1, {
    message: "firstNameRequired",
  }),
  secondName: z.string().min(1, {
    message: "secondNameRequired",
  }),
  whenInstalled: z.date({ required_error: "whenInstalledRequired" }),
  purchasedProducts: z.string({ required_error: "purchasedProductsRequired" }),
  chooseEmployee: z.string({ required_error: "chooseEmployeeRequired" }),
  phoneNumber: z
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
  const prefix = "+998";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      secondName: "",
      phoneNumber: "",
      purchasedProducts: "",
      chooseEmployee: "",
      whenInstalled: "",
    },
  });

  const onSubmit = (data) => {
    const fullPhoneNumber = `${prefix}${data.phoneNumber}`;
    console.log({ ...data, phoneNumber: fullPhoneNumber });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 pt-6">{t("createClient")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center gap-x-5">
            {/* Second Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="firstName"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("firstName")}*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("enterFirstName")}
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
              name="secondName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="secondName"
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
          </div>

          <div className="flex items-center gap-x-5">
            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="phoneNumber"
                    className="text-gray-700  dark:text-white font-medium"
                  >
                    {t("phoneNumber")}*
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="flex bg-white items-center border-[1.6px] rounded-[8px] overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-within:border-primary dark:bg-darkBgInputs dark:border-darkBorderInput">
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
            {/* Purchased Products */}
            <FormField
              control={form.control}
              name="purchasedProducts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="purchasedProducts"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("purchasedProducts")}
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[300px] bg-white" {...field}>
                        <SelectValue placeholder={t("selectProduct")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="product1">Product 1</SelectItem>
                          <SelectItem value="product2">Product 2</SelectItem>
                          <SelectItem value="product3">Product 3</SelectItem>
                          <SelectItem value="product4">Product 4</SelectItem>
                          <SelectItem value="product5">Product 5</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center gap-x-5">
            {/* Choose Employe */}
            <FormField
              control={form.control}
              name="chooseEmployee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="employee"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("employee")}
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[300px]" {...field}>
                        <SelectValue placeholder={t("chooseEmployee")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="employee1">Employee 1</SelectItem>
                          <SelectItem value="employee2">Employee 2</SelectItem>
                          <SelectItem value="employee3">Employee 3</SelectItem>
                          <SelectItem value="employee4">Employee 4</SelectItem>
                          <SelectItem value="employee5">Employee 5</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* When Installed */}
            <FormField
              control={form.control}
              name="whenInstalled"
              render={({ field }) => (
                <FormItem className="flex flex-col mt-[10px]">
                  <FormLabel
                    htmlFor="whenInstalled"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("whenInstalled")}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger
                      asChild
                      className="bg-white dark:bg-darkBgInputs dark:border dark:border-darkBorderInput"
                    >
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[300px] text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            dayjs(field.value).format("MM.DD.YYYY")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
