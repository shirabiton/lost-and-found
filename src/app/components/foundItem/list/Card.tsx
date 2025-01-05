"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Card: React.FC<{ counter: number; id: string }> = ({ counter, id }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/questions/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer border-primary border-2 rounded-xl p-6 mb-4 shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl w-80 mx-auto text-center"
    >
      <h3 className="text-2xl font-bold mb-2">פריט: {counter}</h3>
      <p className="text-lg text-gray-600">לחץ להמשך תהליך</p>
    </div>
  );
};

export default Card;
