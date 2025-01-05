import axios from "axios";
import { User } from "../../types/props/user";

// get all users
export const getUsers = async () => {
  try {
    const response = await axios.get("/api/user", {
      withCredentials: true,
    });
    return response.data;
  } catch {
    throw new Error("Error getting type of user");
  }
};

// get user by id
export const getUserById = async (id: string) => {
  try {
    const response = await axios.get(`/api/user/${id}`);
    return response.data;
  } catch {
    throw new Error("Error getting type of user");
  }
};

// get user by email
export const getUserByEmail = async (email: string) => {
  try {
    const response = await axios.post("/api/user/get-by-email", { email });
    return response.data.data;
  } catch {
    throw new Error("Error getting type of user");
  }
};

// create new user
export const createUser = async (user: User) => {
  try {
    const response = await axios.post("/api/user", user);
    return response.data;
  } catch {
    throw new Error("Error create type of user");
  }
};

// update user by id
export const updateUserById = async (id: string, user: User) => {
  try {
    const response = await axios.put(`/api/user/${id}`, user);
    return response.data;
  } catch {
    throw new Error("Error update type of user");
  }
};

// delete user by id
export const deleteUserById = async (id: string) => {
  try {
    const response = await axios.delete(`/api/user/${id}`);
    return response.data;
  } catch {
    throw new Error("Error delete type of user");
  }
};
