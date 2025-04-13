import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { NavLink, useParams } from "react-router-dom";
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
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function EditProduct() {
    const { t } = useTranslation();
    // const navigate = useNavigate();
    const { id } = useParams();
    const [search, setSearch] = useState("");
    const [viewingImage, setViewingImage] = useState(null);
    const [images, setImages] = useState([]);
    const [initialPhotos, setInitialPhotos] = useState([]);
    const [newPhotos, setNewPhotos] = useState([]);

    const { data: productCategoryData, isLoading } = useGetData({
        endpoint: "/product-categories",
        enabled: true,
        params: {
            search,
        },
        getQueryKey: "/product-category",
    });

    const { data: productDataById, isLoading: productLoading } = useGetData({
        endpoint: `/product/${id}`,
        enabled: !!id,
        getQueryKey: "products",
    });
console.log(productDataById);
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
            photo: null,
        },
    });

    useEffect(() => {
        if (productDataById) {
            const {
                name,
                description,
                price,
                category_id,
                photo,
                percent,
                count_of_product,
            } = productDataById;
            form.reset({
                name: name || "",
                description: description || "",
                price: price?.toString() || "",
                category_id: category_id?.toString() || "",
                percent: percent?.toString() || "",
                count_of_product: count_of_product?.toString() || "",
                photo,
            });
            setInitialPhotos(photo || []);
        }
    }, [productDataById, form]);

    const handleDeleteImage = (index) => {
        const newImages = [...images];
        newImages[index];
        newImages.splice(index, 1);
        setImages(newImages);
        onchange(newImages.map((img) => img.file));
    };

    const openImageViewer = (imageUrl) => {
        setViewingImage(imageUrl);
    };

    const closeImageViewer = () => {
        setViewingImage(null);
    };

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category_id", data.category_id);
        formData.append("percent", data.percent);
        formData.append("count_of_product", data.count_of_product);
        formData.append("id", productDataById.id);

        if (newPhotos.length === 0) {
            initialPhotos.forEach((photo) => {
                formData.append(`photo`, photo);
            });
        } else {
            newPhotos.forEach((photo) => {
                formData.append(`photo`, photo);
            });
        }
        mutate({
            endpoint: `/product/${id}/images`,
            data: formData,
            method: "PUT",
            toastCreateMessage: "productUpdated",
            navigatePath: "/",
            mutateQueryKey: "/products",
        });
    };

    if (productLoading) return "Loading...";

    return (
        <div className="max-w-[900px] tablet:p-6 pt-2">
            <h1 className="text-2xl font-bold mb-6">{t("editProduct")}</h1>
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
                    <div>
                        <FormField
                            control={form.control}
                            name="photo"
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
                        <div>
                            <div className="flex gap-2 mt-2">
                                {form.watch("photos")?.map((image, index) => {
                                  console.log(image);
                                    return (
                                        <div
                                            key={index}
                                            className="relative h-[100px] group w-32 desktop:hover:opacity-80 transition-all duration-300"
                                        >
                                            <div
                                                className="w-32 h-[100px] border border-dashed rounded-md overflow-hidden cursor-pointer"
                                                onClick={() =>
                                                    openImageViewer(image)
                                                }
                                            >
                                                <img
                                                    src={
                                                        image ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={`Uploaded image ${
                                                        index + 1
                                                    }`}
                                                    width={100}
                                                    height={60}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 desktop:opacity-0 desktop:group-hover:opacity-100 transition-opacity"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteImage(index);
                                                }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
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
                                                src={
                                                    viewingImage ||
                                                    "/placeholder.svg"
                                                }
                                                alt="Enlarged image"
                                                width={1200}
                                                height={800}
                                                className="max-h-[80vh] rounded-lg mx-w-[1400px] mx-auto object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
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
