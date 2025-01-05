import { Category } from "@/app/types/props/category";
import { FoundItem } from "../../types/props/foundItem";
import axios from "axios";
import { FoundItemRequest } from "@/app/types/request/foundItemRequest";

// get all found items
export const getFoundItems = async () => {
  try {
    const response = await axios.get("/api/foundItem", {
      withCredentials: true,
    });
    return response.data;
  } catch {
    throw new Error("Failed to get foundItems");
  }
};

//get foundItem by id
export const getFoundItemById = async (id: string) => {
  try {
    const response = await axios.get(`/api/foundItem/${id}`);
    return response.data;
  } catch {
    throw new Error("Failed to get foundItem");
  }
};

// create new found item
export const createFoundItem = async (foundItem: FoundItemRequest,
  currentCategory: Category | null) => {
  try {
    const response = await axios.post("/api/foundItem", {
      ...foundItem,
      category: currentCategory,
    });
    return response.data;
  } catch {
    throw new Error("Failed to get foundItems");
  }
};

// update found item by id
export const updateFoundItemById = async (id: string, foundItem: FoundItem) => {
  try {
    const response = await axios.put(`/api/foundItem/${id}`, foundItem);
    return response.data;
  } catch {
    throw new Error("Failed to updating foundItem");
  }
};


// delete found item by id
export const deleteFoundItemById = async (id: string) => {
  try {
    const response = await axios.delete(`/api/foundItem/${id}`);
    return response.data;
  } catch {
    throw new Error("Failed to deleting foundItem")
  }
};

