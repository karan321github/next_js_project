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
    const db = await mongoose.connect(
      "mongodb+srv://ks867850:Singh8750@cluster0.glvex.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" ||
        "",
      {}
    );
    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected successfully");
  } catch (error) {
    console.log("MongoDB error", error);
    process.exit(1);
  }
}

export default connectDB;
