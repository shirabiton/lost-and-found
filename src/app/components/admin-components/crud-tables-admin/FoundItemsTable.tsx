"use client";
import {
  deleteFoundItemById,
  getFoundItems,
} from "@/app/services/api/foundItemsService";
import { FoundItem } from "@/app/types/props/foundItem";
import { useState, useEffect } from "react";
import EmailSelect from "../EmailsSelect";
import Image from "next/image";

const FoundItemsTable = ({ userEmails }: { userEmails: string[] }) => {
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string>("");

  const fetchFoundItems = async () => {
    const response = await getFoundItems();
    setFoundItems(response.data);
  };

  useEffect(() => {
    fetchFoundItems();
  }, []);

  const handleDelete = async (id: string) => {
    const response = await deleteFoundItemById(id);
    if (response.ok) {
      setFoundItems(foundItems.filter((item) => item._id.toString() !== id));
    }
  };

  const handleEmailSelect = (email: string) => {
    setSelectedEmail(email);
  };

  const filteredItems = foundItems.filter((item) =>
    selectedEmail ? item.userId.email === selectedEmail : true
  );

  const [expandedItem, setExpandedItem] = useState<string | null>(null); // State for expanded item
  const handleTextToggle = (id: string) => {
    setExpandedItem((prev) => (prev === id ? null : id)); // Toggle expanded state
  };

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true); // Open the modal when the image is clicked
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null); // Clear the selected image when modal is closed
  };

  return (
    <div className="p-6">
      {/* Use the EmailSelect component here */}
      <EmailSelect
        userEmails={userEmails}
        selectedEmail={selectedEmail}
        onEmailSelect={handleEmailSelect}
      />

      {/* Responsive Table for Large Screens */}
      <div className="hidden lg:block">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="table-cell px-2 py-1">תת קטגוריה</th>
              <th className="table-cell px-2 py-1">שם משתמש</th>
              <th className="table-cell px-2 py-1">אימייל משתמש</th>
              <th className="table-cell px-2 py-1">צבע</th>
              <th className="table-cell px-2 py-1">מיקום</th>
              <th className="table-cell px-2 py-1">סוג תחבורה ציבורית</th>
              <th className="table-cell px-2 py-1">עיר</th>
              <th className="table-cell px-2 py-1">קו</th>
              <th className="table-cell px-2 py-1">תיאור</th>
              <th className="table-cell px-2 py-1">תמונה</th>
              <th className="table-cell px-2 py-1">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item._id.toString()}
                className="hover:bg-gray-100 even:bg-gray-50"
              >
                <td className="table-cell px-2 py-1">
                  {item.subCategoryId.title}
                </td>
                <td className="table-cell px-2 py-1">{item.userId.fullName}</td>
                <td className="table-cell px-2 py-1">{item.userId.email}</td>
                <td className="table-cell px-2 py-1">{item.colorId?.name}</td>
                <td className="table-cell px-2 py-1">
                  {`${item.postion.latitude}, ${item.postion.longitude}`}
                </td>
                <td className="table-cell px-2 py-1">
                  {item.publicTransport.typePublicTransportId.title}
                </td>
                <td className="table-cell px-2 py-1">
                  {item.publicTransport.city}
                </td>
                <td className="table-cell px-2 py-1">
                  {item.publicTransport.line}
                </td>
                <td
                  className="table-cell cursor-pointer max-w-xs overflow-hidden"
                  onClick={() => handleTextToggle(item._id.toString())}
                >
                  <div className="relative">
                    {expandedItem === item._id.toString() ? (
                      <p className="whitespace-pre-wrap">{item.descripition}</p>
                    ) : (
                      <p className="truncate w-20">{item.descripition}</p>
                    )}
                  </div>
                </td>

                <td className="table-cell px-2 py-1">
                  {item.image ? (
                   <Image
                   src={item.image}
                   alt="Thumbnail"
                   width={64} 
                   height={64} 
                   className="object-cover cursor-pointer"
                   onClick={() => handleImageClick(item.image)}
                 />
                 
                  ) : (
                    "No image"
                  )}
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

      {/* Responsive Card Layout for Small Screens */}
      <div className="block lg:hidden">
        {filteredItems.map((item) => (
          <div
            key={item._id.toString()}
            className="bg-white shadow rounded-lg mb-4 p-4"
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
              <strong>מיקום:</strong>{" "}
              {`${item.postion.latitude}, ${item.postion.longitude}`}
            </p>
            <p>
              <strong>סוג תחבורה ציבורית:</strong>{" "}
              {item.publicTransport.typePublicTransportId.title || "-"}
            </p>
            <p>
              <strong>עיר:</strong> {item.publicTransport.city || "-"}
            </p>
            <p>
              <strong>קו:</strong> {item.publicTransport.line || "-"}
            </p>
            <p className="cursor-pointer">
              <strong>תיאור:</strong> <span>{item.descripition}</span>
            </p>
            <div>
              <strong>תמונה:</strong>{" "}
              {item.image ? (
               <Image
               src={item.image}
               alt="Thumbnail"
               width={64} // Match w-16 (16 * 4px = 64px)
               height={64} // Match h-16 (16 * 4px = 64px)
               className="object-cover cursor-pointer"
               onClick={() => handleImageClick(item.image)}
             />
             
              ) : (
                "No image"
              )}
            </div>
            <button
              className="px-3 py-2 mt-2 bg-[#CF5151] text-white rounded hover:bg-[#D26F6F]"
              onClick={() => handleDelete(item._id.toString())}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Modal to show the full-size image */}
      {isModalOpen && selectedImage && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal} // Close modal when clicking outside the image
        >
          <div
            className="bg-white p-4 rounded relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <Image
              src={selectedImage}
              alt="Full size"
              width={460} 
              height={460}
              className="max-h-80 object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FoundItemsTable;
