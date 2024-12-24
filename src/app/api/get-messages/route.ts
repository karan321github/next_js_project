import connectDB from "@/lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/models/user";

export async function GET(request: Request) {
  await connectDB();

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        { status: 401 }
      );
    }

    const userId = session.user._id
      ? new mongoose.Types.ObjectId(session.user._id)
      : null;

    if (!userId) {
      return Response.json(
        {
          success: false,
          message: "Invalid User ID",
        },
        { status: 400 }
      );
    }

    const user = await UserModel.aggregate([
      { $match: { _id: userId } }, // Match user by ID
      { $project: { messages: 1 } }, // Select only the messages field
      { $unwind: "$messages" }, // Flatten the messages array
      { $sort: { "messages.createdAt": -1 } }, // Sort messages by createdAt
      { $group: { _id: "$_id", messages: { $push: "$messages" } } }, // Regroup messages
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No messages to show",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in fetching messages:", error);
    return Response.json(
      {
        success: false,
        message: "Error in fetching all messages",
      },
      { status: 500 }
    );
  }
}
