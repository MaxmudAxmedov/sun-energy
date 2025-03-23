import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useMutateData } from "@/hook/useApi";
import { Spinner } from "@/components/component/spinner";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(3, { message: "productCategoryNameRequired" }),
});

export default function CreateProductCategory() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutateData();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const submitProductCategory = (positionData) => {
    console.log(positionData);
    mutate({
      endpoint: "/product-category",
      data: positionData,
      toastCreateMessage: "productCategoryCreated",
      navigatePath: "/productCategory",
      mutateQueryKey: "/product-category",
    });
  };

  return (
    <div className="desktop:mt-4">
      <h1 className="text-2xl font-bold mb-8 pt-6">
        {t("createProductCategory")}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitProductCategory)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="productCategoryName"
                  className="text-gray-700 dark:text-white font-medium"
                >
                  {t("productCategoryName")}*
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("enterProductCategoryName")}
                    {...field}
                    className="w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center desktop:mt-9 gap-x-2">
            <Button type="submit">
              {isLoading ? <Spinner /> : t("submit")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="py-[19px]"
              onClick={() => navigate("/productCategory")}
            >
              {t("cancel")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
