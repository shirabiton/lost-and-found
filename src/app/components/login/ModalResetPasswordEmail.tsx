import React, { useState } from "react";
import { z } from "zod";
import { resetPasswordSchema } from "@/app/schemas/loginSchemaZod";
import { getVercelUrlWithoutRequest } from "@/app/utils/vercelUrl";
import { sendEmailForResetPassword } from "@/app/utils/sendToUser";

const PasswordResetModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    try {
      const resetData = resetPasswordSchema.parse({ email });

      const resetUrl = `${getVercelUrlWithoutRequest()}/reset-password?email=${encodeURIComponent(
        resetData.email
      )}`;

      sendEmailForResetPassword(resetData.email, resetUrl);
      setEmail("");
      onClose();
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors.map((e) => e.message).join(", "));
      } else {
        setError("שגיאה לא צפויה");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-200 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-lg text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
          שחזור סיסמה
        </h2>
        <p className="text-base sm:text-lg mb-4">
          אנא הזן את הדואר האלקטרוני שלך לקבלת קישור לאיפוס סיסמה:
        </p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-400 rounded-lg w-full h-12 px-4 text-lg mb-6"
          placeholder="דוא״ל"
        />
        {error && <p className="text-red-600 text-lg mb-4">{error}</p>}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleResetPassword();
            }}
            className="w-full md:w-1/3
         bg-[#FADB3F] text-white py-3 text-lg rounded-lg hover:bg-yellow-500 transition"
          >
            שלח
          </button>
          <button
            onClick={onClose}
            className="w-full md:w-1/3 bg-[#515748] text-white py-3 text-lg rounded-lg hover:bg-red-600 transition"
          >
            בטל
          </button>
        </div>
      </div>
    </div>
  );
};
export default PasswordResetModal;
