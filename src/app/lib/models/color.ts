import { Color } from "@/app/types/props/color";
import mongoose, { Model, Schema } from "mongoose";

const ColorSchema: Schema<Color> = new Schema({
  name: { type: String, required: true },
  groupId: { type: Number, required: true },
  hexadecimal: { type: String, required: true }
});

const ColorModel: Model<Color> =
  mongoose.models.Color || mongoose.model<Color>("Color", ColorSchema);

export default ColorModel;
