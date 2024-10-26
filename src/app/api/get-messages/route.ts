import connectDB from "@/lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/models/user";

export async function GET(request: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const user = session?.user;
  console.log(session);
  console.log(user?._id);
  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "Not  Authenticated",
    });
  }
  const userId = new mongoose.Types.ObjectId(user?._id);
  console.log(userId);
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    console.log(user);
    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No messages to show",
        },
        { status: 401 }
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
    console.error("error in fetching messages", error);
    Response.json(
      {
        success: false,
        message: "Error in fetching all messages",
      },
      { status: 400 }
    );
  }
}
