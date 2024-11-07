import connectDB from "@/lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel, { User } from "@/models/user";
import mongoose from "mongoose";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  const messageId = params.messageId;
  await connectDB();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Not Authenticated",
      }),
      { status: 401 }
    );
  }
  console.log("Received messageId:", messageId); // Debugging line
  // Validate messageId as an ObjectId
  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid messageId format",
      }),
      { status: 400 }
    );
  }

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageId) } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Message not found or already deleted",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message deleted",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error in deleting message",
      }),
      { status: 500 }
    );
  }
}
