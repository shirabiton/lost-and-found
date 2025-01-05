import {
  createTypePublicTransportation,
  getTypePublicTransportations,
} from "@/app/services/api/typePublicTransportationService";
import { TypePublicTransport } from "@/app/types/props/typePublicTransport";
import { Types } from "mongoose";
import React, { useEffect, useState } from "react";

export const TypeTransportationTable = () => {
  const [typePublicTransport, setTypePublicTransport] = useState<
    TypePublicTransport[]
  >([]);
  const [newTypePublicTransport, setNewTypePublicTransport] =
    useState<TypePublicTransport>({
      _id: new Types.ObjectId(),
      title: "",
    });

  useEffect(() => {
    fetchCategorys();
  }, []);

  const fetchCategorys = async () => {
    try {
      const response = await getTypePublicTransportations();
      console.log(response);

      if (response) {
        setTypePublicTransport(response);
      }
    } catch (error) {
      console.error("Failed to fetch categorys:", error);
    }
  };

  const handleAddCategory = async () => {
    const response = await createTypePublicTransportation(
      newTypePublicTransport
    );
    if (response) {
      const createdCategory = await response;
      setTypePublicTransport([...typePublicTransport, createdCategory]);
      fetchCategorys();
      setNewTypePublicTransport({
        _id: new Types.ObjectId(),
        title: "",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="table-auto w-full max-w-4xl mx-auto border-collapse border border-gray-300 hidden md:table">
          <thead className="bg-gray-200">
            <tr>
              <th className="table-title w-1/3 px-2 py-1">Title</th>
              <th className="table-title px-2 w-1/4 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {typePublicTransport?.map((type) => (
              <tr
                key={type._id.toString()}
                className="hover:bg-gray-100 even:bg-gray-50 cursor-pointer text-md"
              >
                <td className="table-title px-2 py-1">{type.title}</td>
                <td className="table-title px-2 py-1"></td>
              </tr>
            ))}

            <tr className="bg-gray-50">
              <td className="table-title px-2 py-1">
                <input
                  type="text"
                  placeholder="New Public Transport Type"
                  value={newTypePublicTransport.title || ""}
                  className="w-full p-2 border rounded text-sm"
                  onChange={(e) =>
                    setNewTypePublicTransport({
                      ...newTypePublicTransport,
                      title: e.target.value,
                    })
                  }
                />
              </td>
              <td className="table-title px-2 py-1">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={handleAddCategory}
                >
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Mobile view */}
        <div className="block md:hidden">
          {typePublicTransport?.map((type) => (
            <div
              key={type._id.toString()}
              className="bg-white shadow-md rounded-lg p-4 mb-4"
            >
              <div className="cursor-pointer text-sm">
                <p>
                  <strong>{type.title}</strong>
                </p>
              </div>
            </div>
          ))}
          <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <input
              type="text"
              placeholder="New Public Trnasport Type"
              value={newTypePublicTransport.title || ""}
              className="w-full p-2 border rounded text-sm mb-2"
              onChange={(e) =>
                setNewTypePublicTransport({
                  ...newTypePublicTransport,
                  title: e.target.value,
                })
              }
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded w-full text-sm"
              onClick={handleAddCategory}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypeTransportationTable;
