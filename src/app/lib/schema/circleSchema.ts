import mongoose from "mongoose";

const CircleSchema = new mongoose.Schema({
  center: {
    lat: { type: Number, required: true, },
    lng: { type: Number, required: true },
  },
  radius: { type: Number, required: true },
});

export default CircleSchema;
