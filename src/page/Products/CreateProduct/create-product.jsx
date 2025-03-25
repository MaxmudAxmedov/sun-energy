import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { ImageUpload } from "@/components/component/Image-Upload";
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
import { SearchbleSelect } from "@/components/component/Searchble-Select";
import { useGetData } from "@/hook/useApi";
import { useMutateData } from "@/hook/useApi";
import { Spinner } from "@/components/component/spinner";

const productSchema = z.object({
    name: z.string().min(1, "productRequired"),
    description: z.string().min(1, "descriptionRequired"),
    price: z.string().min(1, "priceRequired"),
    count_of_product: z.string().min(1, "countOfProductRequired"),
    category_id: z.string().min(1, "categoryRequired"),
    percent: z.string().min(1, "percentRequired"),
    photos: z
        .custom(
            (file) => {
                if (!(file instanceof File)) return false;
                const maxSize = 5 * 1024 * 1024; // 5MB
                const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
                if (file.size > maxSize) return false;
                if (!allowedTypes.includes(file.type)) return false;
                return true;
            },
            {
                message:
                    "Image must be JPG, JPEG or PNG format and less than 5MB",
            }
        )
        .array()
        .min(1, "imageRequired"),
});

export default function CreateProduct() {
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const { data: productCategoryData, isLoading } = useGetData({
        endpoint: "/product-categories",
        enabled: true,
        params: {
            search,
        },
        getQueryKey: "/product-category",
    });
    const { mutate, isLoading: mutateLoading } = useMutateData();

    // console.log(productCategoryData);

    const form = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            price: "",
            category_id: "",
            percent: "",
            count_of_product: "",
            photos: null,
        },
    });

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category_id", data.category_id);
        formData.append("percent", data.percent);
        formData.append("count_of_product", data.count_of_product);

        for (let i = 0; i < data.photos.length; i++) {
            formData.append("photos", data.photos[i]);
        }
        mutate({
            endpoint: "/product-images",
            data: formData,
            toastCreateMessage: "productCreated",
            navigatePath: "/",
            mutateQueryKey: "products",
        });
    };

    return (
        <div className="max-w-[900px] tablet:p-6 pt-2">
            <h1 className="text-2xl font-bold mb-6">{t("createProduct")}</h1>
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
                                    {t("category")}*
                                </FormLabel>
                                <FormControl>
                                    <SearchbleSelect
                                        options={
                                            productCategoryData?.Data
                                                ?.product_categories
                                        }
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        emptyMessage={"EmptyMessage"}
                                        placeholder={t("chooseCategory")}
                                        searchPlaceholder={t("searchCategory")}
                                        onSearch={setSearch}
                                        loading={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Image Uploade */}
                    <FormField
                        control={form.control}
                        name="photos"
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
                                        maxImages={5}
                                        onChange={(files) =>
                                            field.onChange(files)
                                        }
                                    />
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
