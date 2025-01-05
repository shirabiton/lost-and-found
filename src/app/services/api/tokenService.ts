import axios from "axios";

export const verifyToken = async () => {
  try {
    const response = await axios.get("/api/check-token");
    return response.data;
  } catch {
    throw new Error("No valid token");

  }
};
