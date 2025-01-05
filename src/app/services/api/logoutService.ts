import userStore from "@/app/store/userStore";
import axios from "axios";

export const logout = async () => {
  try {
    const response = await axios.post("/api/sign/logout");
    userStore.getState().setAlerts([]);
    return response.data;
  } catch{
    throw new Error("Error creating foundItem");
  }
};
