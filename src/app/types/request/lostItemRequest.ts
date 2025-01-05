import { Types } from "mongoose";
import { Circle } from "../props/circle";
import { PublicTransportRequest } from "./PublicTransportRequest";

export interface LostItemRequest {
    _id: Types.ObjectId;
    subCategoryId: string;
    colorId: string;
    userId: string;
    circles: Circle[] | null;
    publicTransport: PublicTransportRequest | null;
} 