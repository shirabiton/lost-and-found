import mongoose, { Model, Schema } from "mongoose";
import { Thank } from "@/app/types/props/thank";

const ThankSchema: Schema<Thank> = new Schema({
    userName: { type: String, required: true },
    content: { type: String, required: true },
});

const ThankModel: Model<Thank> =
    mongoose.models.Thank || mongoose.model<Thank>("Thank", ThankSchema);

export default ThankModel;