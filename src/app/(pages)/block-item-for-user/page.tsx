import React from "react";
import ContactTheAdmin from "@/app/components/ContactTheAdmin";

const page = () => {
  return (
    <div className="flex h-[65vh]">
      <div className="flex flex-col w-[50%] mx-auto justify-center items-center text-secondary">
        <p>
          <strong className="font-semibold">
            פריט זה נחסם עבורך ולא יוצג לך יותר.
          </strong>
        </p>
        <p className="pb-[5vh]">אם מדובר בפריט שלך- אנא פנה למנהל המערכת.</p>
        <ContactTheAdmin />
      </div>
    </div>
  );
};

export default page;
