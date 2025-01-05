import mongoose from "mongoose";

const PublicTransportSchema = new mongoose.Schema({
    typePublicTransportId: { type: mongoose.Schema.Types.ObjectId, ref: "TypePublicTransport" },
    city: { type: String, required: true },
    line: { type: String, required: true },
});

export default PublicTransportSchema