import { Types } from "mongoose";
import { Category } from "./category";
import { LostItem } from "./lostItem";
import { FoundItem } from "./foundItem";

export interface SubCategory {
    _id: Types.ObjectId;
    title: string;
    categoryId: Category;
    lostItems: LostItem[];
    foundItems: FoundItem[];
}