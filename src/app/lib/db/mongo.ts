import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

let isConnected = false;

const connect = async () => {
  if (isConnected) {
    // If there is already connection to MongoDB - prevents another connection
    console.log("Already connected to MongoDB");
  }
  try {
  const db = await mongoose.connect(MONGODB_URI);
  // If readyState is equal to 1, it indicates that the connection is active
  isConnected = db.connection.readyState === 1;
  console.log("MongoDB connected successfully");
  } catch (error) {
  throw new Error("Error in connecting to MongoDB" + error);
  }
};

export default connect;
