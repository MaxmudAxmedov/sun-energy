import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { NavLink, useParams } from "react-router-dom";
// import { ImageUpload } from "@/components/component/Image-Upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetData } from "@/hook/useApi";
import { useMutateData } from "@/hook/useApi";
import { Spinner } from "@/components/component/spinner";
import { SingleImageUpload } from "@/components/component/SingleUpload";
import { MainScletot } from "@/components/component/main-scletot";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const productSchema = z.object({
  name: z.string().min(1, "productRequired"),
  description: z.string().min(1, "descriptionRequired"),
  price: z.string().min(1, "priceRequired"),
  count_of_product: z.string().min(1, "countOfProductRequired"),
  category_id: z.string().min(1, "categoryRequired"),
  power_system: z.string().optional(),
  show_on_landing: z.boolean().optional(),
  mark_up: z.string().optional(),
  watt: z.string().optional(),
  photo: z.custom(
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

const powerSystems = [
  { id: "on-grid", label: "On-Grid" },
  { id: "off-grid", label: "Off-Grid" },
  { id: "hybrid", label: "Hybrid" },
];

export default function CreateProduct() {
  const { t } = useTranslation();
  const { id } = useParams();
  const {
    data: productCategoryData,
    isLoading,
    isError,
  } = useGetData({
    endpoint: "/product-categories",
    enabled: true,
    getQueryKey: "/product-category",
  });

  const {
    data: productDataById,
    isLoading: productLoading,
    isError: productError,
  } = useGetData({
    endpoint: `/product/${id}`,
    enabled: !!id,
    getQueryKey: "products",
  });

  console.log(productDataById);

  const { mutate, isLoading: mutateLoading } = useMutateData();

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category_id: "",
      count_of_product: "",
      photo: "",
      show_on_landing: "",
      mark_up: "",
      watt: "",
      power_system: "",
    },
  });

  useEffect(() => {
    if (productDataById && id) {
      form.reset({
        name: productDataById.name || "",
        description: productDataById.description || "",
        price: String(productDataById.price) || "",
        count_of_product: String(productDataById.count_of_product) || "",
        category_id: productDataById.category_id || "",
        photo: productDataById?.photo,
        show_on_landing: productDataById?.show_on_landing || false,
        mark_up: productDataById.mark_up || "",
        watt: String(productDataById.watt) || 0,
        power_system: productDataById.power_system || "",
      });
    }
  }, [productDataById, id, form]);

  const onSubmit = (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category_id", data.category_id);
    formData.append("count_of_product", data.count_of_product);
    formData.append("photo", data.photo);
    formData.append("show_on_landing", data.show_on_landing);
    formData.append("mark_up", Number(data.mark_up));
    formData.append("watt", data.watt || 0);
    formData.append("power_system", data.power_system || "");

    mutate({
      endpoint: id ? `/product/${id}/images` : "/product-images",
      data: formData,
      method: id ? "PUT" : "POST",
      toastCreateMessage: id ? "productUpdated" : "productCreated",
      navigatePath: "/",
      mutateQueryKey: "/product",
    });
  };

  {
    productLoading && <MainScletot />;
  }

  {
    productError && "errror";
  }

  return (
    <div className="max-w-[980px] tablet:p-6 pt-2">
      <h1 className="text-2xl font-bold mb-6">
        {" "}
        {id ? "Edit Product" : t("createProduct")}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center flex-wrap gap-x-3">
            {/* Product Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="full_name"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("productName")}*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("enterProductName")}
                      {...field}
                      className="w-[300px] tablet:w-[450px] bigTablet:w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Count of Product */}
            <FormField
              control={form.control}
              name="count_of_product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="count_of_product"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("countOfProduct")}*
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="integer"
                      placeholder={t("enterCountOfProduct")}
                      {...field}
                      className="w-[300px] tablet:w-[450px] bigTablet:w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="price"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("price")}*
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t("enterPrice")}
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
            {/* Product Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="description"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("description")}*
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      type="text"
                      placeholder={t("enterDescription")}
                      {...field}
                      className="bigTablet:w-[611px] w-[300px] tablet:w-[450px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Poweer System */}
            <FormField
              control={form.control}
              name="power_system"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="poweer_system"
                    className="text-gray-700 block dark:text-white font-medium"
                  >
                    {t("poweerSystem")}
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger className="w-[300px] bg-white" {...field}>
                        <SelectValue placeholder={t("choosePoweerSystem")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {powerSystems?.map((item) => (
                            <SelectGroup key={item.id}>
                              <SelectItem value={item.id}>
                                {item?.label}
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
          </div>
          <div className="flex items-end space-y-4 flex-wrap gap-x-3">
            {/* Watt */}
            <FormField
              control={form.control}
              name="watt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="watt"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("watt")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("enterWatt")}
                      {...field}
                      className="w-[300px] tablet:w-[450px] bigTablet:w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="category_id"
                    className="text-gray-700 block dark:text-white font-medium"
                  >
                    {t("productCategory")}*
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger className="w-[300px] bg-white" {...field}>
                        <SelectValue placeholder={t("chooseEmployee")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {isLoading
                            ? t("loading")
                            : isError
                            ? "Error"
                            : productCategoryData?.Data?.product_categories
                                ?.length === 0
                            ? t("datasNotFound")
                            : productCategoryData?.Data?.product_categories?.map(
                                (item) => (
                                  <SelectGroup key={item.id}>
                                    <SelectItem value={item.id}>
                                      {item?.name}
                                    </SelectItem>
                                  </SelectGroup>
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

            {/* show_on_landing */}
            <FormField
              control={form.control}
              name="show_on_landing"
              render={({ field }) => (
                <FormItem className="ml-4 pb-1">
                  <FormLabel
                    htmlFor="show_on_landing"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("show_on_landing")}
                  </FormLabel>
                  <FormControl>
                    <Switch
                      className="block"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="show_on_landing"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            {/* mark_up */}
            <FormField
              control={form.control}
              name="mark_up"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="mark_up"
                    className="text-gray-700 dark:text-white font-medium"
                  >
                    {t("markUp")}*
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t("enterMarkUp")}
                      {...field}
                      className="w-[300px] tablet:w-[450px] bigTablet:w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
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
                  htmlFor="photo"
                  className="text-gray-700 dark:text-white font-medium"
                >
                  {t("image")}*
                </FormLabel>
                <FormControl>
                  <SingleImageUpload
                    defaultImage={id ? productDataById?.photo : ""}
                    onChange={(file) => {
                      field.onChange(file);
                    }}
                  />

                  {/* <ImageUpload
                                        maxImages={5}
                                        onChange={(files) =>
                                            field.onChange(files)
                                        }
                                        defaultImages={
                                            productDataById?.photo || []
                                        }
                                    /> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-x-4 pt-5">
            <NavLink
              to={"/"}
              type="reset"
              className="w-[180px] text-center bg-red-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              {t("cencel")}
            </NavLink>
            <button
              type="submit"
              className="w-[180px] bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              {mutateLoading ? <Spinner /> : t("submit")}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
