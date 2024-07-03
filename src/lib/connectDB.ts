import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: Number;
};

const connection: ConnectionObject = {};

async function connectDB(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected successfuly");
  } catch (error) {
    console.log("MongoDB error", error);
    process.exit(1);
  }
}

export default connectDB;
