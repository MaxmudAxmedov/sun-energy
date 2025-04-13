import React, { useRef, useState, useEffect } from "react";
import { Upload, Trash2, X } from "lucide-react";
import { Button } from "../ui/button";

export const SingleImageUpload = ({ defaultImage = null, onChange }) => {
  const [image, setImage] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (defaultImage) {
      setImage({ file: null, imageUrl: defaultImage });
    }
  }, [defaultImage]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const newImage = { file, imageUrl };
    setImage(newImage);
    onChange(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = () => {
    setImage(null);
    onChange(null);
  };

  return (
    <div className="w-[300px]">
      {!image ? (
        <label
          htmlFor="single-image-upload"
          className="flex items-center justify-center w-full h-[150px] border border-dashed cursor-pointer bg-white p-2 rounded-lg"
        >
          <div className="text-center text-gray-500 flex items-center gap-2">
            <Upload className="w-5 h-5 text-gray-400" />
            <span>Rasm tanlang</span>
          </div>
          <input
            id="single-image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            ref={fileInputRef}
          />
        </label>
      ) : (
        <div className="relative">
          <div
            className="w-full h-[150px] border rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setViewingImage(image.imageUrl)}
          >
            <img
              src={image.imageUrl}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            onClick={handleDelete}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      {viewingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-[-30px] right-[-100px] z-10"
              onClick={() => setViewingImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="p-2 rounded-lg overflow-hidden">
              <img
                src={viewingImage}
                alt="Enlarged image"
                className="max-h-[80vh] mx-auto rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
