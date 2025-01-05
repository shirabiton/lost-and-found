"use client";
import {
  deleteLostItemById,
  getLostItems,
} from "@/app/services/api/lostItemService";
import { LostItem } from "@/app/types/props/lostItem";
import EmailSelect from "../EmailsSelect";
import { useState, useEffect } from "react";

const LostItemsTable = ({ userEmails }: { userEmails: string[] }) => {
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string>("");

  const fetchLostItems = async () => {
    const response = await getLostItems();
    setLostItems(response.data);
  };

  useEffect(() => {
    fetchLostItems();
  }, []);

  const handleDelete = async (id: string) => {
    const response = await deleteLostItemById(id);
    if (response.ok) {
      setLostItems(lostItems.filter((item) => item._id.toString() !== id));
    }
  };

  const handleEmailSelect = (email: string) => {
    setSelectedEmail(email);
  };

  const filteredItems = lostItems.filter((item) =>
    selectedEmail ? item.userId.email === selectedEmail : true
  );

  return (
    <div className="p-6">
      {/* Email Select Component */}
      <EmailSelect
        userEmails={userEmails}
        selectedEmail={selectedEmail}
        onEmailSelect={handleEmailSelect}
      />

      {/* Responsive Table */}
      <div className="hidden lg:block">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="table-cell px-2 py-1">תת קטגוריה</th>
              <th className="table-cell px-2 py-1">שם משתמש</th>
              <th className="table-cell px-2 py-1">אימייל משתמש</th>
              <th className="table-cell px-2 py-1">צבע</th>
              <th className="table-cell px-2 py-1">מרכז המעגל</th>
              <th className="table-cell px-2 py-1">רדיוס המעגל</th>
              <th className="table-cell px-2 py-1">סוג תחבורה ציבורית</th>
              <th className="table-cell px-2 py-1">עיר</th>
              <th className="table-cell px-2 py-1">קו</th>
              <th className="table-cell px-2 py-1">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item._id.toString()}
                className="hover:bg-gray-100 even:bg-gray-50"
              >
                <td className="table-cell px-2 py-1">{item.subCategoryId.title}</td>
                <td className="table-cell px-2 py-1">{item.userId.fullName}</td>
                <td className="table-cell px-2 py-1">{item.userId.email}</td>
                <td className="table-cell px-2 py-1">{item.colorId?.name || "-"}</td>
                <td className="table-cell px-2 py-1">
                  {`${item.circles?.[0]?.center?.lat?.toFixed(2) || "-"} , ${
                    item.circles?.[0]?.center?.lng?.toFixed(2) || "-"
                  }`}
                </td>
                <td className="table-cell px-2 py-1">
                  {item.circles?.[0]?.radius?.toFixed(2) || "-"}
                </td>
                <td className="table-cell px-2 py-1">
                  {item.publicTransport?.typePublicTransportId?.title || "-"}
                </td>
                <td className="table-cell px-2 py-1">
                  {item.publicTransport?.city || "-"}
                </td>
                <td className="table-cell px-2 py-1">
                  {item.publicTransport?.line || "-"}
                </td>
                <td className="table-cell text-center px-2 py-1">
                  <button
                    className="px-3 py-2 bg-[#CF5151] text-white rounded hover:bg-[#D26F6F]"
                    onClick={() => handleDelete(item._id.toString())}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stacked View for Small Screens */}
      <div className="block lg:hidden">
        {filteredItems.map((item) => (
          <div
            key={item._id.toString()}
            className="bg-white shadow rounded-lg mb-4 p-4 border-2 border-solid border-gray-200r"
          >
            <p>
              <strong>תת קטגוריה:</strong> {item.subCategoryId.title}
            </p>
            <p>
              <strong>שם משתמש:</strong> {item.userId.fullName}
            </p>
            <p>
              <strong>אימייל משתמש:</strong> {item.userId.email}
            </p>
            <p>
              <strong>צבע:</strong> {item.colorId?.name || "-"}
            </p>
            <p>
              <strong>מרכז המעגל:</strong>{" "}
              {`${item.circles?.[0]?.center?.lat?.toFixed(2) || "-"} , ${
                item.circles?.[0]?.center?.lng?.toFixed(2) || "-"
              }`}
            </p>
            <p>
              <strong>רדיוס המעגל:</strong>{" "}
              {item.circles?.[0]?.radius?.toFixed(2) || "-"}
            </p>
            <p>
              <strong>סוג תחבורה ציבורית:</strong>{" "}
              {item.publicTransport?.typePublicTransportId?.title || "-"}
            </p>
            <p>
              <strong>עיר:</strong> {item.publicTransport?.city || "-"}
            </p>
            <p>
              <strong>קו:</strong> {item.publicTransport?.line || "-"}
            </p>
            <button
              className="px-3 py-2 mt-2 bg-[#CF5151] text-white rounded hover:bg-[#D26F6F]"
              onClick={() => handleDelete(item._id.toString())}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LostItemsTable;
