import { useRouter } from "next/navigation";
import React from "react";

const HomeButtons: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-y-5 sm:gap-x-14 my-10">
      <button
        className="bg-primary font-extrabold text-lg sm:text-xl py-4 sm:py-6 px-10 sm:px-16 rounded-full border-4 border-secondary shadow-2xl transform transition-all hover:shadow-[0_10px_25px_rgba(0,0,0,0.7)]"
        onClick={() => router.push("/lost-item")}
      >
        דיווח על אבידה
      </button>

      <button
        className="bg-primary font-extrabold text-lg sm:text-xl py-4 sm:py-6 px-10 sm:px-16 rounded-full border-4 border-secondary shadow-2xl transform transition-all hover:shadow-[0_10px_25px_rgba(0,0,0,0.7)]"
        onClick={() => router.push("/found-item")}
      >
        דיווח על מציאה
      </button>
    </div>
  );
};

export default HomeButtons;
