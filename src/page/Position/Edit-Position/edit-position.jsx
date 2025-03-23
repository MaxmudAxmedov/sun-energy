import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  name: z.string().min(1, "fullNameRequired"),
});

export default function EditPosition() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: positionData, isLoading: positionLoading } = useGetData({
    endpoint: `/position/${id}`,
    enabled: !!id,
    getQueryKey: "/positions",
  });

  console.log(positionData);

  const { mutate, isLoading: mutateLoading } = useMutateData();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (positionData) {
      const { name } = positionData;
      form.reset({
        name,
      });
    }
  }, [positionData, form]);

  const onSubmit = (data) => {
    const positionSubmitData = { ...data, id: id };
    mutate({
      endpoint: `/position`,
      method: "PUT",
      data: positionSubmitData,
      toastCreateMessage: "positionUpdated",
      navigatePath: "/position",
      mutateQueryKey: "/positions",
    });
  };

  if (positionLoading) return <div>{t("loading")}...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 pt-6">{t("editEmployee")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

          <div className="flex gap-4">
            <Button type="submit">
              {mutateLoading ? <Spinner /> : t("submit")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/position")}
            >
              {t("cancel")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
