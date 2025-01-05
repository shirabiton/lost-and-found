import axios from "axios";
import { Thank } from "@/app/types/props/thank";

// get all thanks
export const getThanks = async () => {
    try {
        const response = await axios.get("/api/thank");
        return response.data.data;
    } catch {
        throw new Error("Failed to get thanks")
    }
};

// get thank by id
export const getThankById = async (id: string) => {
    try {
        const response = await axios.get(`/api/thank/${id}`);
        return response.data;
    } catch {
        throw new Error("Failed to get thank by id")
    }
};

// create new thank
export const createThank = async (thank: Thank) => {
    try {
        const response = await axios.post("/api/thank", thank);
        return response.data;
    } catch {
        throw new Error("Failed to create thank")
    }
};

// update thank by id
export const updateThankById = async (id: string, thank: Thank) => {
    try {
        const response = await axios.put(`/api/thank/${id}`, thank);
        return response.data;
    } catch {
        throw new Error("Failed to update thank")
    }
};

// delete thank by id
export const deleteThankById = async (id: string) => {
    try {
        const response = await axios.delete(`/api/thank/${id}`);
        console.log(response.data);

        return response.data;
    } catch {
        throw new Error("Failed to delete thank")
    }
};