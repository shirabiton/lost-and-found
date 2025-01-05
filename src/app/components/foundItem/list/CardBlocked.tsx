import { useRouter } from "next/navigation";
import React from "react";

const CardBlocked = () => {
  const router = useRouter();

  const handleClick = () => {
    router.replace("/block-item-for-user");
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-gray-200 border-primary border-2 rounded-xl p-6 mb-4 shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl w-80 mx-auto text-center bg"
    >
      <h3 className="text-2xl font-bold mb-2">פריט חסום</h3>
      <p className="text-lg text-gray-600">לחץ לפניה למנהל</p>
    </div>
  );
};

export default CardBlocked;
