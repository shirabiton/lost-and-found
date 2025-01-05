import mongoose, { Model, Schema } from "mongoose";
import { LostItem } from "@/app/types/props/lostItem";
import CircleSchema from "../schema/circleSchema";
import PublicTransportSchema from "../schema/publicTransportSchema";

const LostItemSchema: Schema<LostItem> = new Schema({
    subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "SubCatrgoy", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    colorId: { type: mongoose.Schema.Types.ObjectId, ref: "Color", required: true },
    circles: [{ type: CircleSchema, _id: false }],
    publicTransport: { type: PublicTransportSchema, _id: false },
});

const LostItemModel: Model<LostItem> =
    mongoose.models.LostItem ||
    mongoose.model<LostItem>("LostItem", LostItemSchema);

export default LostItemModel;