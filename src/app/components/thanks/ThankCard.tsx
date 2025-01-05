import React from "react";
import { Thank } from "@/app/types/props/thank";
import Image from "next/image";

const ThankCard: React.FC<{ thank: Thank }> = ({ thank }) => {
  return (
    <div className="border-[3px] border-primary rounded-md">
      <div className="p-[15px]">
        <div className="flex w-full justify-space gap-3 items-end pb-[10px]">
          {thank.userName ? (
            <span className="text-black font-bold text-2xl bg-gray-300 w-8 h-8 flex justify-center items-center rounded-full">
              {thank.userName[0].toUpperCase()}
            </span>
          ) : (
            <Image
              src="https://res.cloudinary.com/dcsowksj2/image/upload/v1735128218/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait_va7pdc.jpg"
              alt="profile"
              width={50}
              height={50}
              className="rounded-full"
            />
          )}
          <p>{thank.userName}</p>
        </div>
        <hr />
        <p className="w-[15vw] break-words pt-[10px]">{thank.content}</p>
      </div>
    </div>
  );
};

export default ThankCard;
