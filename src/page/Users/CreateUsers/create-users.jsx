import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useGetData, useMutateData } from "@/hook/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  login: z.string().min(1, { message: "loginRequired" }),
  password: z.string().min(1, { message: "passwordRequired" }),
  // lang: z.string().min(1, { message: "langRequired" }),
  // who: z.string().min(1, { message: "whoRequired" }),
});

// const roleData = [
//   { id: 1, name: "admin" },
//   { id: 2, name: "master" },
// ];

// const langData = [
//   { id: 1, name: "uz" },
//   { id: 2, name: "ru" },
//   { id: 3, name: "en" },
// ];

export default function CreateUsers() {
  const { id } = useParams();
  //   console.log(id);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutateData();

  const { data: userData } = useGetData({
    endpoint: `/user/${id}`,
    getQueryKey: "/users",
    enabled: true,
  });

  console.log(userData);


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
      // lang: "",
      // who: "",
    },
  });

  useEffect(() => {
    if (userData) {
      form.setValue("login", userData.login);
      form.setValue("password", userData.password);
      // form.setValue("lang", userData.lang);
      // form.setValue("who", userData.who);
    }
  }, [userData, form]);

  const submitUser = (data) => {
    console.log(data);

    const finalData = {
      login: data.login,
      password: data.password,
      lang: undefined,
      who: undefined,
      id: id ? id : null,
    };

    mutate({
      endpoint: id === "new" ? "/user" : `/user`,
      method: id === "new" ? "POST" : "PUT",
      data: finalData,
      toastCreateMessage: id === "new" ? "userCreated" : "userUpdated",
      navigatePath: "/users",
      mutateQueryKey: "/users",
    });
  };

  return (
    <div className="h-screen">
      <h1 className="text-2xl font-bold mb-8 pt-6">
        {id === "new" ? "Create User" : "Edit User"}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitUser)}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="login"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("userNmae")}*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        id !== "new" ? t("enterNewLogin") : t("enterLogin")
                      }
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="password"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("password")}*
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        id !== "new"
                          ? t("enterNewPassword")
                          : t("enterPassword")
                      }
                      {...field}
                      className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 
            <FormField
              control={form.control}
              name="lang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="lang"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("language")}*
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={userData?.is_superuser}
                      value={id !== "new" ? userData?.lang : field.value}
                    >
                      <SelectTrigger className="w-[300px]" {...field}>
                        <SelectValue placeholder={t("chooseLanguage")} />
                      </SelectTrigger>
                      <SelectContent>
                        {langData?.length === 0
                          ? t("datasNotFound")
                          : langData?.map((item) => (
                              <SelectGroup key={item.id}>
                                <SelectItem value={item.name}>
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
            <FormField
              control={form.control}
              name="who"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="who"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("role")}*
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[300px]" {...field}>
                        <SelectValue
                          placeholder={
                            id !== "new" ? t("chooseNewRole") : t("chooseRole")
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {roleData?.length === 0
                          ? t("datasNotFound")
                          : roleData?.map((item) => (
                              <SelectGroup key={item.id}>
                                <SelectItem value={item.name}>
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
            */}
          </div>

          <div className="flex items-center mt-8 desktop:mt-9 gap-x-2">
            <Button type="submit">
              {isLoading ? <Spinner /> : t("submit")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="py-[19px]"
              onClick={() => navigate("/setting")}
            >
              {t("cancel")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
