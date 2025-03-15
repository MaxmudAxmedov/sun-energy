import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@radix-ui/react-label";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { SearchbleSelect } from "@/components/component/Searchble-Select";
import { ImageUpload } from "@/components/component/Image-Upload";

const productSchema = z.object({
  name: z.string().min(1, "productRequired"),
  description: z.string().min(1, "descriptionRequired"),
  price: z.string().min(1, "Price is required"),
  category: z.string().min(1, "Category is required"),
  percentage: z.string().min(1, "percentageRequired"),
  image: z
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
        message: "Image must be JPG, JPEG or PNG format and less than 5MB",
      }
    )
    .optional(),
});

export default function CreateProduct() {
  const { t } = useTranslation();
  
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      percentage: "",
      image: null,
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    console.log(data);
    Object.keys(data).forEach((key) => {
      if (key === "image" && data[key]) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });
    console.log(Object.fromEntries(formData));
    // TODO: Implement product creation logic
  };

  return (
    <div className="max-w-[900px] tablet:p-6 pt-2">
      <h1 className="text-2xl font-bold mb-6">{t("createProduct")}</h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-full"
      >
        <div className="flex items-center gap-x-5">
          <div className="space-y-2 w-full">
            <Label
              htmlFor="name"
              className="text-gray-700 dark:text-white font-medium"
            >
              {t("productName")}*
            </Label>
            <input
              id="name"
              {...form.register("name")}
              placeholder={t("enterProductName")}
              className="w-full p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
            />
            {form.formState.errors.name && (
              <p className="text-red-500 leading-none text-sm">
                {t(form.formState.errors.name.message)}
              </p>
            )}
          </div>
          <div className="space-y-2 w-full">
            <Label
              htmlFor="price"
              className="text-gray-700 dark:text-white font-medium"
            >
              {t("price")}*
            </Label>
            <input
              id="price"
              type="number"
              {...form.register("price")}
              placeholder={t("enterPrice")}
              className="w-full p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
            />
            {form.formState.errors.price && (
              <p className="text-red-500 leading-none text-sm">
                {t(form.formState.errors.price.message)}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t("description")}*</Label>
          <textarea
            id="description"
            {...form.register("description")}
            placeholder={t("enterDescription")}
            className="w-full p-2 border dark:bg-darkBgInputs dark:border-darkBorderInput rounded-md h-32"
          />
          {form.formState.errors.description && (
            <p className="text-red-500 text-sm leading-none">
              {t(form.formState.errors.name.message)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-x-4 justify-between">
          <div className="space-y-2 w-full">
            <Label
              htmlFor="percentage"
              className="text-gray-700 dark:text-white font-medium"
            >
              {t("percentage")}*
            </Label>
            <input
              id="percentage"
              type="text"
              {...form.register("percentage")}
              placeholder={t("enterPercentage") + " %"}
              className="w-full p-2 border rounded-[8px] dark:bg-darkBgInputs dark:border-darkBorderInput"
            />
            {form.formState.errors.percentage && (
              <p className="text-red-500 leading-none text-sm">
                {t(form.formState.errors.percentage.message)}
              </p>
            )}
          </div>
          <div className="space-y-2 w-full">
            <Label
              htmlFor="percentage"
              className="text-gray-700 dark:text-white font-medium"
            >
              {t("category")}*
            </Label>
            <SearchbleSelect placeholder="selectCategoryPlacholder" />
            {form.formState.errors.percentage && (
              <p className="text-red-500 leading-none text-sm">
                {t(form.formState.errors.percentage.message)}
              </p>
            )}
          </div>
        </div>
        {/* Image Uploade */}
        <div className="space-y-2 max-w-[350px]">
          <Label
            htmlFor="image"
            className="text-gray-700 dark:text-white font-medium"
          >
            {t("image")}
          </Label>
          <ImageUpload maxImages={5} />
          {/* <div className="w-full">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-[350px] h-34 border-2 border-gray-300 border-dashed rounded-[8px] cursor-pointer bg-gray-50 dark:bg-darkBgInputs hover:bg-gray-100"
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex gap-x-3 items-center justify-center pt-5 pb-5">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">{t("chooseImage")}</span>
                  </p>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
            {form.formState.errors.image && (
              <p className="text-red-500 mt-1 leading-none text-sm">
                {t(form.formState.errors.image.message)}
              </p>
            )}
          </div> */}
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
            {t("submit")}
          </button>
        </div>
      </form>
    </div>
  );
}
