import React from "react";
import UploadImage from "../form/UploadImage";

const InsertFinderDetails: React.FC<{
  setImage: (image: string) => void;
  description: string;
  setDescription: (description: string) => void;
}> = ({ setImage, description, setDescription }) => {
  return (
    <>
      <UploadImage setImage={setImage} />
      <input
        type="text"
        placeholder="כתוב תיאור קצר על הפריט שמצאת"
        value={description}
        className="w-[50%] text-center"
        onChange={(e) => setDescription(e.target.value)}
      />
    </>
  );
};

export default InsertFinderDetails;
