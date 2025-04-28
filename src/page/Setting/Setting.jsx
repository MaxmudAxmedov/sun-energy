import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/providers/ThemeProvider";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
// import Calculator from "@/components/component/Calculator";
import { DynamicHeader } from "@/components/component/Dynamic-Header";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useGetData, useMutateData } from "@/hook/useApi";
import { saveState } from "@/lib/storage";
import { CustomDeleteDialog } from "@/components/component/Custom-Delete-Dialog";
import { EditIcon } from "@/assets/icons/edit-icon";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/component/Dynamic-Table";
import { MainScletot } from "@/components/component/main-scletot";
import { FetchingError } from "@/components/component/FetchingError";

export default function Setting() {
  const { i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const { mutate } = useMutateData();
  let percentMain = localStorage.getItem("percent") || 0;
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetData({
    endpoint: "/users",
    params: {},
    enabled: true,
    getQueryKey: "/users",
  });

  console.log(data?.Data);

  const form = useForm({
    defaultValues: {
      percent: percentMain,
    },
  });

  useEffect(() => {
    form.setValue("percent", percentMain);
  }, [form, percentMain]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  const column = [
    {
      header: "No",
      cell: ({ row }) => {
        return <div>{row.index + 1}</div>;
      },
    },
    {
      accessorKey: "login",
      header: "name",
    },
    {
      header: "createdAt",
      cell: ({ row }) => {
        return <div>{dayjs(row.original.created_at).format("DD/MM/YYYY")}</div>;
      },
    },
    {
      header: "updatedAt",
      cell: ({ row }) => {
        const updateDate = row?.original?.updated_at;
        return (
          <div>
            {updateDate
              ? dayjs(row?.original?.updated_at).format("DD/MM/YYYY")
              : "-------------"}
          </div>
        );
      },
    },
    {
      header: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            {/* <button
                onClick={infoClick(row.original)}
                className=" bg-green-600 py-2 px-3 rounded-[15px]"
              >
                <EyeIcon />
              </button>
              <DynamicDrawer
                selectedRowData={selectedRowData}
                isSheetOpen={isSheetOpen}
                setIsSheetOpen={setIsSheetOpen}
              /> */}
            <button
              onClick={() => navigate(`/createUsers/${row.original.id}`)}
              className=" bg-green-100 py-2 px-3 rounded-[15px]"
            >
              <EditIcon />
            </button>
            <CustomDeleteDialog
              dynamicRowId={row.original.id}
              endpoint={`user`}
              mutateQueryKey={"users"}
              deleteToastMessage={"userDeleted"}
            />
          </div>
        );
      },
    },
  ];

  const submitData = (data) => {
    const percentNummeric = parseFloat(data?.percent?.replace(",", "."));
    saveState("percent", percentNummeric);

    mutate({
      endpoint: `/employee-income/${percentNummeric}`,
      method: "PATCH",
      data: {
        percent: percentNummeric,
      },
      toastCreateMessage: t("percentChanged"),
    });
    form.reset();
  };

  if (isLoading) return <MainScletot />;
  if (isError) return <FetchingError />;

  return (
    <div>
      <DynamicHeader
        title="Settings"
        isCreat={true}
        btnNavigate={"/createUsers/new"}
      />
      <div>
        <h2 className="text-textPrimaryColor dark:text-white font-semibold text-[16px] mb-1 mt-4">
          {t("languageChange")}:
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger className="px-4 py-1.5 rounded-lg bg-gray-700 text-white hover:bg-gray-600">
            {i18n?.language.toUpperCase()}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => changeLanguage("en")}
              className={i18n?.language === "en" ? "bg-blue-500/10" : ""}
            >
              English
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeLanguage("uz")}
              className={i18n?.language === "uz" ? "bg-blue-500/10" : ""}
            >
              O'zbekcha
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeLanguage("ru")}
              className={i18n?.language === "ru" ? "bg-blue-500/10" : ""}
            >
              Русский
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <h2 className="text-textPrimaryColor dark:text-white font-semibold text-[16px] mb-1 mt-4">
          {t("themeChange")}:
        </h2>
        <div className="flex items-center tablet:gap-4 gap-3">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            className="justify-start tablet:max-w-[140px] max-w-[100px] text-[13px] tablet:text-[14px] tablet:py-5 py-4"
            onClick={() => setTheme("light")}
          >
            <Sun className="h-4 w-4" />
            {t("light")}
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            className="justify-start tablet:max-w-[140px] text-[13px] max-w-[100px] tablet:text-[14px] tablet:py-5 py-4"
            onClick={() => setTheme("dark")}
          >
            <Moon className="h-3 w-3 tablet:h-4 tablet:w-4" />
            {t("dark")}
          </Button>
          <Button
            variant={theme === "system" ? "default" : "outline"}
            className="justify-start tablet:max-w-[140px] max-w-[100px] text-[13px] tablet:text-[14px] tablet:py-5 py-4"
            onClick={() => setTheme("system")}
          >
            <Monitor className="h-4 w-4" />
            {t("system")}
          </Button>
        </div>
        <div className="flex justify-between max-w-[850px]">
          {/* <Calculator /> */}
          <div className="tablet:mt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submitData)}>
                <div className="flex items-end gap-x-5">
                  <FormField
                    control={form.control}
                    name="percent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor="percent"
                          className="text-gray-700 dark:text-white font-medium"
                        >
                          {t("percentForEmployee")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            value={field?.value}
                            required
                            placeholder={
                              t("enterPercentForEmployee") +
                              "                         %"
                            }
                            {...field}
                            className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-4">
                    {t("submit")}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <DataTable data={data?.Data?.users} columns={column} />
      </div>
    </div>
  );
}
