"use client";
import React from "react";
import { CldUploadWidget } from "next-cloudinary";

const UploadImage: React.FC<{ setImage: (image: string) => void }> = ({
  setImage,
}) => {
  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      signatureEndpoint="/api/upload/image"
      onSuccess={(result) => {
        if (typeof result.info === "object" && "secure_url" in result.info) {
          setImage(result.info.secure_url);
        }
      }}
      options={{
        singleUploadAutoClose: true,
        folder: "found_item_images",
      }}
    >
      {({ open }) => {
        return (
          <button type="button" onClick={() => open()} className="primary-btn">
            העלה תמונה של הפריט
          </button>
        );
      }}
    </CldUploadWidget>
  );
};

export default UploadImage;
