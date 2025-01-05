import { FoundItem } from "@/app/types/props/foundItem";
import { LostItem } from "@/app/types/props/lostItem";
import axios from "axios"

export const matchLostFound = async (lostItem: LostItem, categoryId: string) => {
    try {
        const response = await axios.post("/api/match/lost-found", {
            lostItem,
            categoryId,
        })
        return response.data.data
    } catch (error) {
        throw new Error("Failed match lost to found", error)
    }
}

export const matchFoundLost = async (foundItem: FoundItem, categoryId: string) => {
    try {
        const response = await axios.post("/api/match/found-lost", {
            foundItem,
            categoryId
        })
        return response.data.data
    } catch (error) {
        throw new Error("Failed match found to lost", error)
    }
}