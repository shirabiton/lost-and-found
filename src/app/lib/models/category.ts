import { Category } from "@/app/types/props/category";
import mongoose, { Model, Schema } from "mongoose"

const CategorySchema: Schema<Category> = new Schema({
    title: { type: String, required: true, unique: true },
    subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" }]
})

const CategoryModel: Model<Category> =
    mongoose.models.Category ||
    mongoose.model<Category>("Category", CategorySchema);

export default CategoryModel;