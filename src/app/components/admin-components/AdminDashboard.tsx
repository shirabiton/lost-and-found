"use client";
import React, { useEffect, useState } from "react";
import { UsersTable } from "./crud-tables-admin/UsersTable";
import CategorysTable from "./crud-tables-admin/CategoriesTable";
import LostItemsTable from "./crud-tables-admin/LostItemsTable";
import FoundItemsTable from "./crud-tables-admin/FoundItemsTable";
import { ColorTable } from "./crud-tables-admin/ColorTable";
import { TypeTransportationTable } from "./crud-tables-admin/TypeTransportationTable";
import { getUsers } from "@/app/services/api/userService";
import { Bars3Icon } from "@heroicons/react/20/solid"; // For hamburger icon

export const AdminDashboard = () => {
  const [activeTable, setActiveTable] = useState("users");
  const [userEmails, setUserEmails] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar visibility
  const [isSmallScreen, setIsSmallScreen] = useState(false); // Track if the screen is small

  const fetchUserEmails = async () => {
    try {
      const response = await getUsers();
      const emails = response.data.map((user: { email: string }) => user.email);
      setUserEmails(emails);
    } catch (error) {
      console.error("Failed to fetch user emails:", error);
    }
  };

  useEffect(() => {
    fetchUserEmails();

    // Set initial screen size state
    setIsSmallScreen(window.innerWidth <= 768);

    // Update screen size state on window resize
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const renderTable = () => {
    switch (activeTable) {
      case "users":
        return <UsersTable />;
      case "categories":
        return <CategorysTable />;
      case "Lost items":
        return <LostItemsTable userEmails={userEmails} />;
      case "Found items":
        return <FoundItemsTable userEmails={userEmails} />;
      case "Colors":
        return <ColorTable />;
      case "Transportation":
        return <TypeTransportationTable />;
      default:
        return null;
    }
  };

  const handleTableClick = (table: string) => {
    setActiveTable(table);
    // Close the sidebar only on small screens
    if (isSmallScreen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100" dir="rtl">
      {/* Hamburger Icon - Visible below header */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="absolute top-28 right-4 z-50 bg-[#27332D] text-white p-2 rounded-full sm:hidden"
        >
          <Bars3Icon className="w-8 h-8" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64 p-6" : "w-0"
        } bg-[#27332D] text-white overflow-hidden transition-all duration-300 ease-in-out`}
      >
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="text-white mb-4 sm:hidden"
        >
          <Bars3Icon className="w-8 h-8" />
        </button>

        {isSidebarOpen && (
          <nav>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => handleTableClick("users")}
                  className={`block w-full text-right text-lg font-semibold p-2 rounded ${
                    activeTable === "users"
                      ? "bg-[#515748]"
                      : "hover:bg-[#515748]"
                  }`}
                >
                  ניהול משתמשים
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTableClick("categories")}
                  className={`block w-full text-right text-lg font-semibold p-2 rounded ${
                    activeTable === "categories"
                      ? "bg-[#515748]"
                      : "hover:bg-[#515748]"
                  }`}
                >
                  ניהול קטגוריות
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTableClick("Lost items")}
                  className={`block w-full text-right text-lg font-semibold p-2 rounded ${
                    activeTable === "Lost items"
                      ? "bg-[#515748]"
                      : "hover:bg-[#515748]"
                  }`}
                >
                  ניהול חפצים שאבדו
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTableClick("Found items")}
                  className={`block w-full text-right text-lg font-semibold p-2 rounded ${
                    activeTable === "Found items"
                      ? "bg-[#515748]"
                      : "hover:bg-[#515748]"
                  }`}
                >
                  ניהול חפצים שנמצאו
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTableClick("Colors")}
                  className={`block w-full text-right text-lg font-semibold p-2 rounded ${
                    activeTable === "Colors"
                      ? "bg-[#515748]"
                      : "hover:bg-[#515748]"
                  }`}
                >
                  ניהול צבעים
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTableClick("Transportation")}
                  className={`block w-full text-right text-lg font-semibold p-2 rounded ${
                    activeTable === "Transportation"
                      ? "bg-[#515748]"
                      : "hover:bg-[#515748]"
                  }`}
                >
                  ניהול סוגי תחבורה ציבורית
                </button>
              </li>
            </ul>
          </nav>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-white shadow p-6 overflow-y-auto">
        {renderTable()}
      </div>
    </div>
  );
};
