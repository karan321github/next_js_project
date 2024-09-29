import connectDB from "@/lib/connectDB";
import UserModel from "@/models/user";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
  await connectDB();
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    console.log(session);

    if (!session || !session.user) {
      return Response.json({
        success: false,
        message: "Not  Authenticated",
      });
    }

    const userId = user?._id;
    const { acceptMessages } = await request.json();
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { isAcceptMessage: acceptMessages },
        { new: true }
      );
      if (!updatedUser) {
        return Response.json(
          {
            success: false,
            message: "Failed to update user status to accept messages",
          },
          { status: 401 }
        );
      } else {
        return Response.json(
          {
            success: true,
            message: "Message acceptance status changes successfully ",
            updatedUser
          },
          { status: 200 }
        );
      }
    } catch (error) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept messages",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Failed to update user status to accept messages");
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages",
      },
      { status: 400 }
    );
  }
}
