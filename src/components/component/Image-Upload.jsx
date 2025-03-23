import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Eye, Trash2, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ImageUpload = ({ maxImages = 5, onChange }) => {
  const [images, setImages] = useState([]);
  const [viewingImage, setViewingImage] = useState(null);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();

  console.log(images);

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const newImages = [];
    Array.from(files).forEach((file) => {
      if (images.length + newImages.length < maxImages) {
        const imageUrl = URL.createObjectURL(file);
        newImages.push({ file, imageUrl });
      }
    });

    setImages([...images, ...newImages]);
    // Pass the updated images to the parent via onChange
    onChange([...images, ...newImages].map((img) => img.file));
  };

  const handleDeleteImage = (index) => {
    const newImages = [...images];
    newImages[index];
    newImages.splice(index, 1);
    setImages(newImages);
    onChange(newImages.map((img) => img.file));
  };

  const openImageViewer = (imageUrl) => {
    setViewingImage(imageUrl);
  };

  const closeImageViewer = () => {
    setViewingImage(null);
  };

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }

  return (
    <div className="w-[710px]">
      {/* Image thumbnails */}
      <div>
        {/* Upload button */}
        {images.length < maxImages ? (
          <div className="w-32">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-[303px] h-[39px] border border-dashed cursor-pointer bg-white p-2 dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
            >
              <div className="flex items-center justify-between gap-x-2">
                <Upload className="w-5 h-5 text-gray-400 " />
                <p className="text-[14px] text-gray-500 text-center">
                  {t("chooseImage")}
                </p>
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
                ref={fileInputRef}
              />
            </label>
          </div>
        ) : (
          <div className="w-32">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-[303px] h-[39px] border border-dashed cursor-not-allowed bg-white p-2 dark:bg-darkBgInputs dark:border-darkBorderInput rounded-[8px]"
            >
              <div className="flex items-center justify-between gap-x-2">
                {/* <Upload className="w-5 h-5 text-gray-400 " /> */}
                <p className="text-[14px] text-gray-500 text-center">
                  {t("canNotChooseImage")}
                </p>
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                disabled
                className="hidden"
              />
            </label>
          </div>
        )}

        <div className="flex gap-2 mt-2">
          {images.map((image, index) => {
            console.log(image);
            return (
              <div
                key={index}
                className="relative h-[100px] group w-32 hover:opacity-80 transition-all duration-300"
              >
                <div
                  className="w-32 h-[100px] border border-dashed rounded-md overflow-hidden cursor-pointer"
                  onClick={() => openImageViewer(image.imageUrl)}
                >
                  <img
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={`Uploaded image ${index + 1}`}
                    width={100}
                    height={60}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                src={viewingImage || "/placeholder.svg"}
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
  );
};
