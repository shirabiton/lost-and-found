import axios from "axios";
import { LostItemRequest } from "@/app/types/request/lostItemRequest";
import { Category } from "@/app/types/props/category";

// get all lost items
export const getLostItems = async () => {
  try {
    const response = await axios.get("/api/lostItem", {
      withCredentials: true,
    });
    return response.data;
  } catch {
    throw new Error("Failed to get lostItems");
  }
};

// get lost item by id
export const getLostItemById = async (id: string) => {
  try {
    const response = await axios.get(`/api/lostItem/${id}`);
    return response.data;
  } catch {
    throw new Error("Failed to get lostItem by id");
  }
};

// create new lost item
export const createLostItem = async (
  lostItem: LostItemRequest,
  currentCategory: Category
) => {
  try {
    const response = await axios.post("/api/lostItem", {
      ...lostItem,
      category: currentCategory,
    });
    return response.data.data[0];
  } catch {
    throw new Error("Failed to create lostItem");
  }
};

// update lost item by id
export const updateLostItemById = async (
  id: string,
  lostItem: LostItemRequest
) => {
  try {
    const response = await axios.put(`/api/lostItem/${id}`, lostItem);
    return response.data;
  } catch {
    throw new Error("Failed to update lostItem");
  }
};

// delete lost item by id
export const deleteLostItemById = async (id: string) => {
  try {
    const response = await axios.delete(`/api/lostItem/${id}`);

    return response.data;
  } catch {
    throw new Error("Failed to delete lostItem");
  }
};
