import { Types } from "mongoose";

export interface Color {
    _id: Types.ObjectId;
    name: string;
    groupId: number;
    hexadecimal: string;
}