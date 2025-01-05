import { Alert } from "@/app/types/props/alert";
import axios from "axios";

export const createAlert = async (userId: string, massage: string, link: string) => {
  try {
    const newAlert = {
      message: massage,
      userId: userId,
      link: link,
      read: false,
    };
    const response = await axios.post("/api/alert", newAlert);
    return response.data;
  } catch {
    throw new Error("Error creating alert");
  }
};

// get alert by id
export const getAlertById = async (id: string) => {
  try {
    const response = await axios.get(`/api/alert/${id}`);
    return response.data.data;
  } catch {
    throw new Error("Error getting alert");
  }
};

// update alert by id
export const updateAlertById = async (id: string, alert: Alert) => {
  try {
    const response = await axios.put(`/api/alert/${id}`, alert);
    return response.data.data;
  } catch {
    throw new Error("Error updating color");
  }
};
