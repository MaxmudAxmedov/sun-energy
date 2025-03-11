import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Eye, Trash2, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ImageUpload = ({ maxImages = 5 }) => {
  const [images, setImages] = useState([]);
  const [viewingImage, setViewingImage] = useState(null);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();

  console.log(images);
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = [];

      Array.from(e.target.files).forEach((file) => {
        if (images.length + newImages.length < maxImages) {
          const imageUrl = URL.createObjectURL(file);
          newImages.push(imageUrl);
        }
      });

      setImages([...images, ...newImages]);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index]);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const openImageViewer = (imageUrl) => {
    setViewingImage(imageUrl);
  };

  const closeImageViewer = () => {
    setViewingImage(null);
  };

  return (
    <div className="w-[710px]">
      {/* Image thumbnails */}
      <div className="flex  flex-wrap gap-4 mb-4">
        {/* Upload button */}
        {images.length < maxImages && (
          <div className="w-32">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-[80px] border border-dashed rounded-md cursor-pointer bg-white hover:bg-gray-50"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-xs text-gray-500 text-center">
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
        )}

        {images.map((image, index) => (
          <div key={index} className="relative group hover:opacity-80 transition-all duration-300">
            <span className="absolute hidden group-hover:block left-[50px] top-[40px]">
              <Eye className="w-5 h-5 text-white"/>
            </span>
            <div
              className="w-32 h-[100px] border border-dashed rounded-md overflow-hidden cursor-pointer"
              onClick={() => openImageViewer(image)}
            >
              <img
                src={image || "/placeholder.svg"}
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
        ))}
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
