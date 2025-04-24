import React, { useEffect, useState } from "react";
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

const productSchema = z.object({
    name: z.string().min(1, "productRequired"),
    description: z.string().min(1, "descriptionRequired"),
    price: z.string().min(1, "priceRequired"),
    count_of_product: z.string().min(1, "countOfProductRequired"),
    category_id: z.string().min(1, "categoryRequired"),
    percent: z.string().min(1, "percentRequired"),
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
                return (
                    value.size <= maxSize && allowedTypes.includes(value.type)
                );
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

export default function CreateProduct() {
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const { id } = useParams();
    const {
        data: productCategoryData,
        isLoading,
        isError,
    } = useGetData({
        endpoint: "/product-categories",
        enabled: true,
        params: {
            search,
        },
        getQueryKey: "/product-category",
    });

    console.log(productCategoryData);

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
            percent: "",
            count_of_product: "",
            photo: "",
            show_on_landing: "",
        },
    });

    useEffect(() => {
        if (productDataById && id) {
            form.reset({
                name: productDataById.name || "",
                description: productDataById.description || "",
                price: String(productDataById.price) || "",
                count_of_product:
                    String(productDataById.count_of_product) || "",
                category_id: productDataById.category_id || "",
                percent: String(productDataById.percent) || "",
                photo: productDataById?.photo,
            });
        }
    }, [productDataById, id]);

    const onSubmit = (data) => {
        console.log(data);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category_id", data.category_id);
        formData.append("percent", data.percent);
        formData.append("count_of_product", data.count_of_product);
        formData.append("photo", data.photo);
        formData.append("show_on_landing", false);

        mutate({
            endpoint: id ? `/product/${id}/images` : "/product-images",
            data: formData,
            method: id ? "PUT" : "POST",
            toastCreateMessage: id ? "productUpdated" : "productCreated",
            navigatePath: "/",
            mutateQueryKey: "/product-categories",
        });
    };

    {
        productLoading && <MainScletot />;
    }

    {
        productError && "errror";
    }

    return (
        <div className="max-w-[900px] tablet:p-6 pt-2">
            <h1 className="text-2xl font-bold mb-6">
                {" "}
                {id ? "Edit Product" : t("createProduct")}
            </h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 max-w-full"
                >
                    <div className="flex flex-col bigTablet:flex-row bigTablet:items-center space-y-4 bigTablet:space-y-0 gap-x-5">
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
                                            placeholder={t(
                                                "enterCountOfProduct"
                                            )}
                                            {...field}
                                            className="w-[300px] tablet:w-[450px] bigTablet:w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

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
                                        className="bigTablet:w-[620px] w-[300px] tablet:w-[450px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-col bigTablet:flex-row bigTablet:items-center bigTablet:space-y-0 space-y-4 gap-x-4">
                        {/* Precent */}
                        <FormField
                            control={form.control}
                            name="percent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        htmlFor="percent"
                                        className="text-gray-700 dark:text-white font-medium"
                                    >
                                        {t("percent")}*
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="integer"
                                            placeholder={t("enterPercent")}
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
                                            className="w-[303px] tablet:w-[450px] bigTablet:w-[300px] bg-white p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
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
                                        <SelectTrigger
                                            className="w-[300px] bg-white"
                                            {...field}
                                        >
                                            <SelectValue
                                                placeholder={t(
                                                    "chooseEmployee"
                                                )}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {isLoading
                                                    ? t("loading")
                                                    : isError
                                                    ? "Error"
                                                    : productCategoryData?.Data
                                                          ?.product_categories
                                                          ?.length === 0
                                                    ? t("datasNotFound")
                                                    : productCategoryData?.Data?.product_categories?.map(
                                                          (item) => (
                                                              <SelectGroup
                                                                  key={item.id}
                                                              >
                                                                  <SelectItem
                                                                      value={
                                                                          item.id
                                                                      }
                                                                  >
                                                                      {
                                                                          item?.name
                                                                      }
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
                                        defaultImage={
                                            id ? productDataById?.photo : ""
                                        }
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
