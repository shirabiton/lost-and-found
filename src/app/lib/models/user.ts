import { User } from "@/app/types/props/user";
import mongoose, { Model, Schema } from "mongoose";
import ChatSchema from "../schema/chatSchema";

const UserSchema: Schema<User> = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    lostItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "LostItem" }],
    foundItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "FoundItem" }],
    blockedItems: [{ type: String }],
    alerts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Alert" }],
    chatRooms: [{ type: ChatSchema, _id: false }],
});

const UserModel: Model<User> =
    mongoose.models.User ||
    mongoose.model<User>("User", UserSchema);

export default UserModel;