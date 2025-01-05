import { Types } from "mongoose";

export interface TypePublicTransport {
    _id: Types.ObjectId;
    title: string | null;
}