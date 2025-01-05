import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    roomId: { type: String, required: true, },
    userNameFound: { type: String, required: true },
    userNameLost: { type: String, required: true },
    available: { type: Boolean, required: true },
});

export default ChatSchema;