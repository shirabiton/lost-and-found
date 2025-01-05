import mongoose, { Model, Schema } from "mongoose";
import { TypePublicTransport } from "@/app/types/props/typePublicTransport";

const TypePublicTransportSchema: Schema<TypePublicTransport> = new Schema({
    title: { type: String, required: true },
});

const TypePublicTransportModel: Model<TypePublicTransport> =
    mongoose.models.TypePublicTransport ||
    mongoose.model<TypePublicTransport>("TypePublicTransport", TypePublicTransportSchema);

export default TypePublicTransportModel;