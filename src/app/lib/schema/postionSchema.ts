import mongoose from "mongoose";

const PostionSchema = new mongoose.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
});

export default PostionSchema