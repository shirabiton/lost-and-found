"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import userStore from "../../store/userStore";
import { logout } from "../../services/api/logoutService";
import { Types } from "mongoose";

export const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const currentUser = userStore((state) => state.user);
  const setUser = userStore((state) => state.setUser);

  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const router = useRouter();

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  // Handle logout and redirect to login
  const handleLogout = () => {
    if (currentUser) {
      logout();
      setUser({
        _id: new Types.ObjectId(),
        fullName: "",
        email: "",
        password: "",
        phone: "",
        alerts: [],
        blockedItems: [],
        foundItems: [],
        lostItems: [],
      });
      console.log("Logging out...");
    } else {
      console.log("Redirecting to login...");
    }
    setIsOpen(false); // Close the menu after action
    router.push("/login");
  };
  const handleUserDashboard = () => {
    router.push("/user-dashboard");
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      ref={profileRef}
    >
      {/* Profile icon or image */}
      <div
        onClick={toggleMenu}
        className="cursor-pointer w-12 h-12 flex justify-center items-center rounded-full bg-gray-300"
        style={{ backgroundColor: currentUser ? "#ccc" : "transparent" }}
      >
        {currentUser?.fullName ? (
          <span className="text-black font-bold text-3xl">
            {currentUser.fullName[0].toUpperCase()}
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
      </div>

      {/* Profile menu */}
      {isOpen && (
        <div className="absolute top-[110%] left-1/2 transform -translate-x-1/2 bg-white border border-[#ccc] rounded-md p-2 shadow-lg z-10 w-[70px]">
          {/* user dashboard */}
          {currentUser?.fullName ? (
            <div
              className="p-2 text-sm cursor-pointer text-black w-fit"
              onClick={handleUserDashboard}
            >
              איזור אישי
            </div>
          ) : (
            <></>
          )}
          {/* Logout/Login Option */}
          <div
            className="p-2 cursor-pointer text-black text-sm"
            onClick={handleLogout}
          >
            {currentUser?.fullName ? "התנתק" : "התחבר"}
          </div>
        </div>
      )}
    </div>
  );
};
