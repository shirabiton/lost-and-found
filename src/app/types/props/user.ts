import { Types } from "mongoose";
import { LostItem } from "./lostItem";
import { FoundItem } from "./foundItem";
import { Alert } from "./alert";
import { Chat } from "./chat";

export interface User {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
    password: string;
    phone: string;
    lostItems?: LostItem[];
    foundItems?: FoundItem[];
    blockedItems?: string[];
    alerts?: Alert[];
    chatRooms?: Chat[]
}