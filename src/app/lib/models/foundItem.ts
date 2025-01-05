import mongoose, { Model, Schema } from "mongoose"
import { FoundItem } from "@/app/types/props/foundItem";
import PostionSchema from "../schema/postionSchema";
import QuestionSchema from "../schema/questionSchema";
import PublicTransportSchema from "../schema/publicTransportSchema";

const FoundItemSchema: Schema<FoundItem> = new Schema({
    subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "SubCatrgoy", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    colorId: { type: mongoose.Schema.Types.ObjectId, ref: "Color", required: true },
    postion: { type: PostionSchema, _id: false },
    publicTransport: { type: PublicTransportSchema, _id: false },
    image: { type: String },
    descripition: { type: String },
    questions: [{ type: QuestionSchema, required: true, _id: false }],
});

const FoundItemModel: Model<FoundItem> =
    mongoose.models.FoundItem ||
    mongoose.model<FoundItem>("FoundItem", FoundItemSchema);

export default FoundItemModel;