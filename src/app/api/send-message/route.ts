import connectDB from "@/lib/connectDB";
import UserModel from "@/models/user";
import { Message } from "@/models/user";

export async function POST(request: Request) {
  await connectDB();
  try {
    const { username, content } = await request.json();
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (!user.isAcceptMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
  } catch (error) {
    console.log("An unexpected error occurred:", error);
    return Response.json(
      {
        success: false,
        message: "Error in sending messages",
      },
      { status: 400 }
    );
  }
}
