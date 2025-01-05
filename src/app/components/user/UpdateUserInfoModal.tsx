import React, { useState } from "react";
import { z } from "zod";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { signUpSchema } from "../../schemas/loginSchemaZod";
import { Types } from "mongoose";
import { UpdateUserModalProps } from "@/app/types/UpdateUserModalProps";

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialUserData,
}) => {
  const [formData, setFormData] = useState({
    _id: initialUserData._id as Types.ObjectId,
    fullName: initialUserData.fullName,
    email: initialUserData.email,
    password: "",
    phone: initialUserData.phone,
    alerts: initialUserData.alerts,
    blockedItems: initialUserData.blockedItems,
    foundItems: initialUserData.foundItems,
    lostItems: initialUserData.lostItems,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSave = () => {
    try {
      // Validate the form data using the updateUserSchema
      signUpSchema.parse(formData);
      onSave(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors: { [key: string]: string } = {};
        err.errors.forEach((error) => {
          if (error.path.length > 0) {
            validationErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(validationErrors);
      }
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">עדכון פרטי משתמש</h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="fullName" className="text-lg font-medium">
              שם מלא
            </label>
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full h-12 px-4 border border-gray-400 rounded-lg text-lg"
            />
            {errors.fullName && (
              <span className="text-red-500 text-sm">{errors.fullName}</span>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="email" className="text-lg font-medium">
              דוא״ל
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full h-12 px-4 border border-gray-400 rounded-lg text-lg"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          <div className="grid gap-2 relative">
            <label htmlFor="password" className="text-lg font-medium">
              סיסמה
            </label>
            <div className="relative flex items-center w-full">
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute left-4 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-6 h-6" />
                ) : (
                  <EyeIcon className="w-6 h-6" />
                )}
              </button>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full h-12 px-4 border border-gray-400 rounded-lg text-lg pl-12"
              />
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="phone" className="text-lg font-medium">
              טלפון
            </label>
            <input
              id="phone"
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full h-12 px-4 border border-gray-400 rounded-lg text-lg"
            />
            {errors.phone && (
              <span className="text-red-500 text-sm">{errors.phone}</span>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
            >
              ביטול
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-[#FADB3F] text-white rounded-lg hover:bg-yellow-500"
            >
              שמור
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserModal;
