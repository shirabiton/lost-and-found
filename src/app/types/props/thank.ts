import { Types } from "mongoose";

export interface Thank {
    _id?: Types.ObjectId;
    userName: string;
    content: string;
}