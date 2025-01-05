"use client";
import {
  createUser,
  deleteUserById,
  getUsers,
  updateUserById,
} from "@/app/services/api/userService";
import { User } from "@/app/types/props/user";
import { Types } from "mongoose";
import React, { useEffect, useState } from "react";
// import Swal from "sweetalert2";

export const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<User>({
    _id: new Types.ObjectId(0),
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [updateUser, setupdateUser] = useState<User>({
    _id: new Types.ObjectId(0),
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });
  const fetchUsers = async () => {
    try {
      const usersData = await getUsers();
      if (usersData) {
        setUsers(usersData.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // no dependency

  const handleDelete = async (id: string) => {
    await deleteUserById(id);
    setUsers(users.filter((user) => user._id?.toString() !== id));
  };

  const handleEdit = async (id: string, updatedUser: User) => {
    console.log("user edit", updateUser);

    await updateUserById(id, updatedUser);
    setUsers(
      users.map((user) =>
        user._id?.toString() === id ? { ...user, ...updatedUser } : user
      )
    );
    setIsEditing(null);
  };

  const handleAdd = async () => {
    console.log("user add ", newUser);

    const response = await createUser(newUser);
    if (response) {
      const createdUser = await response;
      setUsers([...users, createdUser]);
      setNewUser({
        _id: new Types.ObjectId(),
        fullName: "",
        email: "",
        password: "",
        phone: "",
      });
    } else {
    }
  };

  const handleIsEditing = (user: User) => {
    if (user._id) {
      setIsEditing(user._id.toString());
      setupdateUser({
        _id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        password: user.password,
        email: user.email,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 hidden md:table">
          <thead className="bg-gray-200">
            <tr>
              <th className="table-cell text-center">שם מלא</th>
              <th className="table-cell text-center">דואר אלקטרוני</th>
              <th className="table-cell text-center">סיסמה</th>
              <th className="table-cell text-center">טלפון</th>
              <th className="table-cell text-center">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id && user._id.toString()}
                className="hover:bg-gray-100 even:bg-gray-50"
              >
                {isEditing === user._id?.toString() ? (
                  <>
                    <td className="table-cell">
                      <input
                        type="text"
                        defaultValue={user.fullName}
                        className="w-full p-2 border rounded"
                        onChange={(e) =>
                          setupdateUser((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                      />
                    </td>
                    <td className="table-cell">
                      <input
                        type="email"
                        defaultValue={user.email}
                        className="w-full p-2 border rounded"
                        onChange={(e) =>
                          setupdateUser((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </td>
                    <td className="table-cell">
                      <input
                        type="text"
                        defaultValue={
                          user.password
                            ? user.password[0] +
                              "*".repeat(user.password.length - 1)
                            : ""
                        }
                        className="w-full p-2 border rounded"
                        disabled
                      />
                    </td>
                    <td className="table-cell">
                      <input
                        type="text"
                        defaultValue={user.phone}
                        className="w-full p-2 border rounded"
                        onChange={(e) =>
                          setupdateUser((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </td>
                    <td className="table-cell text-center">
                      <button
                        className="px-4 py-2 mr-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => {
                          if (user._id)
                            handleEdit(user._id.toString(), updateUser);
                        }}
                      >
                        שמירה
                      </button>
                      <button
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        onClick={() => setIsEditing(null)}
                      >
                        ביטול
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="table-cell">{user.fullName}</td>
                    <td className="table-cell">{user.email}</td>
                    <td className="table-cell">
                      {user.password
                        ? user.password[0] +
                          "*".repeat(user.password.length - 1)
                        : ""}
                    </td>

                    <td className="table-cell">{user.phone}</td>
                    <td className="table-cell text-center justify-evenly">
                      <button
                        className="px-4 py-2 mr-2 bg-primary text-white rounded hover:bg-[#FFE35A]"
                        onClick={() => handleIsEditing(user)}
                      >
                        עריכה
                      </button>
                      <button
                        className="px-4 py-2 bg-[#CF5151] text-white rounded hover:bg-[#D26F6F]"
                        onClick={() =>
                          user._id && handleDelete(user._id.toString())
                        }
                      >
                        מחיקה
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            <tr className="bg-gray-100">
              <td className="table-cell">
                <input
                  type="text"
                  placeholder="שם מלא"
                  value={newUser.fullName || ""}
                  className="w-full p-2 border rounded"
                  onChange={(e) =>
                    setNewUser({ ...newUser, fullName: e.target.value })
                  }
                />
              </td>
              <td className="table-cell">
                <input
                  type="email"
                  placeholder="דואר אלקטרוני"
                  value={newUser.email || ""}
                  className="w-full p-2 border rounded"
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </td>
              <td className="table-cell">
                <input
                  type="text"
                  placeholder="סיסמה"
                  value={newUser.password || ""}
                  className="w-full p-2 border rounded"
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
              </td>
              <td className="table-cell">
                <input
                  type="text"
                  placeholder="טלפון"
                  value={newUser.phone || ""}
                  className="w-full p-2 border rounded"
                  onChange={(e) =>
                    setNewUser({ ...newUser, phone: e.target.value })
                  }
                />
              </td>
              <td className="table-cell text-center">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={handleAdd}
                >
                  הוספה
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="block md:hidden">
          {users.map((user) => (
            <div
              key={user._id?.toString()}
              className="bg-white shadow-md rounded-lg p-4 mb-4"
            >
              {isEditing === user._id?.toString() ? (
                <div>
                  <input
                    type="text"
                    defaultValue={user.fullName}
                    className="w-full p-2 border rounded mb-2"
                    onChange={(e) =>
                      setupdateUser((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                  />
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full p-2 border rounded mb-2"
                    onChange={(e) =>
                      setupdateUser((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                  <input
                    type="text"
                    defaultValue={user.password}
                    className="w-full p-2 border rounded mb-2"
                    disabled
                  />
                  <input
                    type="text"
                    defaultValue={user.phone}
                    className="w-full p-2 border rounded mb-2"
                    onChange={(e) =>
                      setupdateUser((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                  <div className="flex justify-between mt-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => {
                        if (user._id)
                          handleEdit(user._id.toString(), updateUser);
                      }}
                    >
                      שמירה
                    </button>
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                      onClick={() => setIsEditing(null)}
                    >
                      ביטול
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p>
                    <strong>שם מלא:</strong> {user.fullName}
                  </p>
                  <p>
                    <strong>דואר אלקטרוני:</strong> {user.email}
                  </p>
                  <p>
                    <strong>סיסמה:</strong> {user.password}
                  </p>
                  <p>
                    <strong>טלפון:</strong> {user.phone}
                  </p>
                  <div className="flex justify-between mt-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-2 rounded"
                      onClick={() => handleIsEditing(user)}
                    >
                      עריכה
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-2 rounded"
                      onClick={() =>
                        user._id && handleDelete(user._id.toString())
                      }
                    >
                      מחיקה{" "}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <input
              type="text"
              placeholder="שם מלא"
              value={newUser.fullName || ""}
              className="w-full p-2 border rounded mb-2"
              onChange={(e) =>
                setNewUser({ ...newUser, fullName: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="דואר אלקטרוני"
              value={newUser.email || ""}
              className="w-full p-2 border rounded mb-2"
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="סיסמה"
              value={newUser.password || ""}
              className="w-full p-2 border rounded mb-2"
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="טלפון"
              value={newUser.phone || ""}
              className="w-full p-2 border rounded mb-2"
              onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
            />
            <div className="flex justify-between mt-2">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleAdd}
              >
                הוספה{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UsersTable;
