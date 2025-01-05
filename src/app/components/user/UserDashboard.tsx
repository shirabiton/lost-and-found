"use client";
import React, { useState } from "react";
import userStore from "../../store/userStore";
import UpdateUserModal from "./UpdateUserInfoModal";
import { updateUserById } from "../../services/api/userService";
import { Types } from "mongoose";

const UserDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentUser = userStore((state) => state.user);
  const setUser = userStore((state) => state.setUser);

  const handleSave = (updatedData: {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    if (currentUser && currentUser._id) {
      updateUserById(currentUser._id.toString(), updatedData);
      setUser(updatedData);
      setIsModalOpen(false);
    } else {
      console.error("Current user or user ID is undefined.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 p-6 rounded-lg  order-last lg:order-first">
          <h2 className="text-2xl font-semibold">פרטים אישיים:</h2>
          <div className="space-y-4 mt-4">
            <p>
              <strong>שם מלא:</strong> {currentUser?.fullName}
            </p>
            <p>
              <strong>כתובת דואר אלקטרוני:</strong> {currentUser?.email}
            </p>
            <p>
              <strong>טלפון:</strong> {currentUser?.phone}
            </p>
            <p>
              <strong>סיסמה:</strong> {currentUser?.password}
            </p>
            <button
              className="primary-btn px-8 py-2 font-semibold text-black rounded-md hover:primary"
              onClick={() => {
                setIsModalOpen(!isModalOpen);
              }}
            >
              עריכת הפרטים האישיים
            </button>
          </div>
        </div>

        <div className="col-span-2 space-y-6">
          {/* Lost Items Section */}
          <div className=" p-6 rounded-lg ">
            <h2 className="text-2xl font-semibold">פריטים שאבדו</h2>
            {currentUser?.lostItems && currentUser?.lostItems.length > 0 ? (
              <div className="space-y-4 mt-4">
                {currentUser.lostItems.map((item) => (
                  <div
                    key={item._id?.toString()}
                    className="border border-gray-200 p-4 rounded-md"
                  >
                    <h3 className="font-semibold">
                      {item.subCategoryId?.title}
                    </h3>
                    <p className="text-gray-500">{item.colorId?.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">לא נמצאו פריטים.</p>
            )}
          </div>

          {/* Found Items Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold">פריטים שנמצאו</h2>
            {currentUser?.foundItems && currentUser?.foundItems.length > 0 ? (
              <div className="space-y-4 mt-4">
                {currentUser.foundItems.map((item) => (
                  <div
                    key={item._id?.toString()}
                    className="border border-gray-200 p-4 rounded-md"
                  >
                    <h3 className="font-semibold">
                      {item.subCategoryId?.title}
                    </h3>
                    <p className="text-gray-500">{item.descripition}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">לא נמצאו פריטים.</p>
            )}
          </div>
        </div>
      </div>
      <UpdateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialUserData={
          currentUser
            ? currentUser
            : {
                _id: new Types.ObjectId(),
                fullName: "",
                email: "",
                password: "",
                phone: "",
              }
        }
        
      />
    </div>
  );
};

export default UserDashboard;
