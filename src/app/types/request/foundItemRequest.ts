import { Types } from "mongoose";
import { Postion } from "../props/postion";
import { PublicTransportRequest } from "./PublicTransportRequest";
import { Question } from "../props/question";


export interface FoundItemRequest {
    _id: Types.ObjectId;
    userId: string;
    subCategoryId: string;
    colorId: string;
    postion: Postion | null;
    publicTransport: PublicTransportRequest | null;
    image: string;
    descripition: string;
    questions: Question[]
} 