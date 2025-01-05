import axios from "axios";
import { getCategoryById } from "./categoryService";
import { SubCategory } from "@/app/types/props/subCategory";

export const createSubCategory = async (subCategory:SubCategory) => {
  try {
    // Check if the category exists
    const response = await getCategoryById(String(subCategory.categoryId._id));
    if (!response) {
      throw new Error("Category does not exist");
    }

    // Create the new subcategory
    const newSubCategory = await axios.post("api/sub-category", subCategory);

    return newSubCategory.data;
  } catch {
    throw new Error("Failed to create subcategory");
  }
};


// get sub category by id
export const getSubCategoryById = async (id: string) => {
  try {
    const response = await axios.get(`/api/sub-category/${id}`);
    return response.data;
  } catch {
    throw new Error("Failed to get subcategory by id")
  }
};