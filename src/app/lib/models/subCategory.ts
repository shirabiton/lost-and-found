import mongoose, { Model, Schema } from "mongoose"
import { SubCategory } from "@/app/types/props/subCategory";

const SubCategorySchema: Schema<SubCategory> = new Schema({
    title: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    lostItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "LostItem" }],
    foundItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "FoundItem" }],
});

const SubCategoryModel: Model<SubCategory> =
    mongoose.models.SubCategory ||
    mongoose.model<SubCategory>("SubCategory", SubCategorySchema);

export default SubCategoryModel;