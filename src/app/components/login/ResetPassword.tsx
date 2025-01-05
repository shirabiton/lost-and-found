"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getUserByEmail, updateUserById } from "../../services/api/userService";
import { User } from "../../types/props/user";
import { resetPasswordSchema } from "../../schemas/resetPasswordSchema";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export const ResetPassword: React.FC<{ email: string }> = ({ email }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // get the user by email
  const { data, error, isLoading } = useQuery({
    queryKey: ["user", email], // Query key as an object property
    queryFn: () => getUserByEmail(email),
    enabled: !!email, // Runs only if email is truth
  });

  // Toggle show/hide password button
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle show/hide password button
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  if (!email) return <div>מייל לא זמין.</div>;
  if (isLoading) return <div>טוען...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    const formData = { password, confirmPassword };
    const validation = resetPasswordSchema.safeParse(formData);

    if (!validation.success) {
      const errors = validation.error.errors;
      setErrorMessage(errors[0].message);
      setPassword("");
      setConfirmPassword("");
      return; // Exit early if validation fails
    }

    if (!user || !user._id) {
      setErrorMessage("המשתמש לא נמצא או נתוני המשתמש לא חוקיים.");
      return;
    }

    try {
      // Update user password
      const updatedUser = await updateUserById(user._id.toString(), {
        ...user,
        password,
      });
      console.log("Updated User:", updatedUser);
      setSuccess("הסיסמה עודכנה בהצלחה. ");
      setPassword("");
      setConfirmPassword("");
      setErrorMessage("");
      await delay(1500);
      if (router) {
        router.push("/login");
      }
    } catch (err) {
      console.error("Error updating password:", err);
      setErrorMessage("שגיאה בעדכון הסיסמה. נסה שוב.");
    }
  };

  return (
    <div className="bg-gray-100 p-8 sm:p-12 rounded-lg shadow-lg max-w-lg mx-auto mt-20">
    <h1 className="text-3xl font-bold mb-6 text-center">איפוס סיסמה</h1>
    <form onSubmit={handleSubmit}>
      <div className="relative w-full flex flex-col gap-2">
        <label htmlFor="password" className="text-lg font-medium">
          סיסמה חדשה:
        </label>
        <div className="relative flex items-center w-full">
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute left-4 flex items-center text-gray-600 hover:text-gray-800"
          >
            {showPassword ? (
              <EyeSlashIcon className="w-6 h-6" />
            ) : (
              <EyeIcon className="w-6 h-6" />
            )}
          </button>
          <input
            className="w-full h-12 px-4 border border-gray-400 rounded-lg text-lg pl-12"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="הזן סיסמה חדשה"
          />
        </div>
      </div>
  
      {/* Confirm password */}
      <div className="relative w-full flex flex-col gap-2 mb-4">
        <label htmlFor="confirmPassword" className="text-lg font-medium">
          אשר סיסמה חדשה:
        </label>
        <div className="relative flex items-center w-full">
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute left-4 flex items-center text-gray-600 hover:text-gray-800"
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="w-6 h-6" />
            ) : (
              <EyeIcon className="w-6 h-6" />
            )}
          </button>
          <input
            className="w-full h-12 px-4 border border-gray-400 rounded-lg text-lg pl-12"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="אשר את הסיסמה"
          />
        </div>
      </div>
  
      {errorMessage && (
        <p className="text-red-600 text-lg mb-6">{errorMessage}</p>
      )}
      {success && <p className="text-green-600 text-lg mb-6">{success}</p>}
  
      <button
        type="submit"
        className="w-full bg-[#FADB3F] text-white py-3 text-lg rounded-lg hover:bg-yellow-500 transition"
      >
        שמור סיסמה
      </button>
    </form>
  </div>
  )}
  export default ResetPassword;  