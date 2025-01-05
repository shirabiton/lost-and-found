"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import userStore from "../../store/userStore";
import { loginAuthenticationCookies } from "../../services/api/loginAuth";
import { signupAuthenticationCookies } from "../../services/api/signupAuth";
import { loginSchema, signUpSchema } from "@/app/schemas/loginSchemaZod";
import PasswordResetModal from "./ModalResetPasswordEmail";

const LoginForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const setUser = userStore((state) => state.setUser);

  useEffect(() => {
    const clearData = () => {
      setFullName("");
      setEmail("");
      setPassword("");
      setError("");
      setPhone("");
    };

    clearData();
  }, []);

  const router = useRouter();

  // Log in / Sign up
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  // Send reset password email modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Toggle show/hide password button
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Submit function - zod validation
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = { email, password, phone, fullName };
      if (isLogin) {
        const loginData = loginSchema.parse({ email, password });
        await login(loginData);
      } else {
        const signUpData = signUpSchema.parse(formData);
        await signUp(signUpData);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle sign up
  const signUp = async (signUpData: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
  }) => {
    try {
      const response = await signupAuthenticationCookies(
        signUpData.email,
        signUpData.phone.replace(/^0/, "+972"),
        signUpData.fullName,
        signUpData.password
      );
      if (response) {
        setUser(response.data.user.data); // Update the store with user data
        router.push("/");
      } else {
        setError("שגיאה");
      }
    } catch (error) {
      handleError(error, "Account creation failed.");
    }
  };

  // Handle log in
  const login = async (loginData: { email: string; password: string }) => {
    try {
      const response = await loginAuthenticationCookies(
        loginData.email,
        loginData.password
      );

      if (response) {
        if (response.user) {
          // The user logged in successfully
          setUser(response.user); // Update the store with user data
          if (router) {
            router.push("/");
          }
        } else {
          // The user is logged in already
          if (router) {
            router.push("/home");
          }
        }
      } else {
        setError("שם משתמש או סיסמא אינם נכונים");
      }
    } catch (error) {
      console.error(error);
      setError("שגיאה לא צפויה");
    }
  };

  // Error handler
  const handleError = (error: unknown, defaultMessage: string) => {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      setError(error.response.data.message || defaultMessage);
      setIsLogin(true);
    } else {
      setError("שגיאה לא צפויה, נסה שוב");
    }
  };

  return (
    <div className="bg-gray-200 space-y-16 w-full h-auto text-black p-8 md:p-12">
      <div className="flex flex-col md:flex-row justify-center md:space-x-6 mb-8">
        {/* Toggle buttons */}
        <button
          onClick={toggleForm}
          className={`px-8 py-3 text-2xl font-semibold mb-4 md:mb-0 ${
            isLogin
              ? "bg-[#FADB3F] text-white rounded-t-lg"
              : "bg-transparent text-[#FADB3F] border-b-4 border-[#FADB3F]"
          }`}
        >
          התחברות
        </button>
        <button
          onClick={toggleForm}
          className={`px-8 py-3 text-2xl font-semibold ${
            !isLogin
              ? "bg-[#FADB3F] text-white rounded-t-lg"
              : "bg-transparent text-[#FADB3F] border-b-4 border-[#FADB3F]"
          }`}
        >
          הרשמה
        </button>
      </div>

      <form onSubmit={onSubmit}>
        {!isLogin && (
          // Full name input
          <div className="grid w-full items-center gap-2">
            <label htmlFor="fullname" className="text-lg font-medium">
              שם מלא:
            </label>
            <input
              className="w-full h-12 px-4 border border-gray-400 rounded-lg text-lg"
              required={!isModalOpen}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              id="username"
              type="text"
            />
          </div>
        )}
        {/* Email input */}
        <div className="grid w-full items-center gap-2">
          <label htmlFor="email" className="text-lg font-medium">
            דואר אלקטרוני:
          </label>
          <input
            className="w-full h-12 px-4 border border-gray-400 rounded-lg text-lg"
            required={!isModalOpen}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            type="text"
          />
        </div>
        {!isLogin && (
          // Phone input
          <div className="grid w-full items-center gap-2">
            <label htmlFor="phone" className="text-lg font-medium">
              טלפון:
            </label>
            <input
              className="w-full h-12 px-4 border border-gray-400 rounded-lg text-lg"
              required={!isModalOpen}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              id="phone"
              type="text"
            />
          </div>
        )}
        {/* Password input */}
        <div className="relative w-full flex flex-col gap-2">
          <label htmlFor="password" className="text-lg font-medium">
            סיסמה:
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
              required={!isModalOpen}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              type={showPassword ? "text" : "password"}
            />
          </div>
        </div>

        {/* Forgot password */}
        {isLogin ? (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              openModal();
            }}
            className="text-blue-600 underline mt-2 inline-block"
          >
            שכחת סיסמה?
          </a>
        ) : null}

        {/* Submit form button */}
        {!isModalOpen && (
          <>
            <button
              className="w-full bg-[#FADB3F] text-white py-3 mt-6 text-lg rounded-lg font-semibold hover:bg-yellow-500 transition"
              disabled={loading}
            >
              {isLogin ? "התחברות" : "הרשמה"}
            </button>
            {loading && (
              <p className="text-yellow-600 mt-2 text-center text-lg font-medium">
                נא המתן...
              </p>
            )}
            {error && <p className="text-red-700 mt-4 text-lg">{error}</p>}
          </>
        )}
        {/* Modal to input email to reset */}
        <PasswordResetModal isOpen={isModalOpen} onClose={closeModal} />
      </form>
    </div>
  );
};
export default LoginForm;