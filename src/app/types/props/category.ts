import { Types } from "mongoose";
import { SubCategory } from "./subCategory";

export interface Category {
    _id: Types.ObjectId;
    title: string;
    subCategories: SubCategory[];
}