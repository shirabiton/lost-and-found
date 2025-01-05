import { Alert } from "@/app/types/props/alert";
import mongoose, { Model, Schema } from "mongoose";

const AlertSchema: Schema<Alert> = new Schema({
  message: { type: String, required: true },
  link: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  read: { type: Boolean, required: true },
});

const AlertModel: Model<Alert> =
  mongoose.models.Alert || mongoose.model<Alert>("Alert", AlertSchema);

export default AlertModel;
