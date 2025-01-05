import axios from "axios";
import { Color } from "../../types/props/color";

// get all colors
export const getColors = async () => {
  try {
    const response = await axios.get("/api/color");
    return response.data.data;
  } catch {
    throw new Error("Failed to get colors")
  }
};

// get color by id
export const getColorById = async (id: string) => {
  try {
    const response = await axios.get(`/api/color/${id}`);
    return response.data;
  } catch {
    throw new Error("Failed to get color by id")
  }
};

// create new color
export const createColor = async (color: Color) => {
  try {
    const response = await axios.post("/api/color", color);
    return response.data;
  } catch {
    throw new Error("Failed to create color")
  }
};

// update color by id
export const updateColorById = async (id: string, color: Color) => {
  try {
    const response = await axios.put(`/api/color/${id}`, color);
    return response.data;
  } catch {
    throw new Error("Failed to update color")
  }
};

// delete color by id
export const deleteColorById = async (id: string) => {
  try {
    const response = await axios.delete(`/api/color/${id}`);
    return response.data;
  } catch {
    throw new Error("Failed to delete color")
  }
};