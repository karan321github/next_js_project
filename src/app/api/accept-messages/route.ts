import connectDB from "@/lib/connectDB";
import UserModel from "@/models/user";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  try {
    const userId = new ObjectId(session.user._id);
    const { acceptMessages } = await request.json();
    console.log("Request payload:", { acceptMessages });

    if (typeof acceptMessages !== "boolean") {
      return Response.json(
        { success: false, message: "Invalid data format" },
        { status: 400 }
      );
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        { success: false, message: "Failed to update user status" },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return Response.json(
      { success: false, message: "Error updating status" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  try {
    const userId = new ObjectId(session.user._id);
    const user = await UserModel.findById(userId);

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, isAcceptingMessage: user.isAcceptMessage },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return Response.json(
      { success: false, message: "Error fetching data" },
      { status: 500 }
    );
  }
}
