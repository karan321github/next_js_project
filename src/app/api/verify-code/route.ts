import { sendSuccessVerification } from "@/helper/sendVerificationEmail";
import connectDB from "@/lib/connectDB";
import UserModel from "@/models/user";

export async function POST(request: Request) {
  await connectDB();
  try {
    const { userName, code } = await request.json();
    const decodedUsername = decodeURIComponent(userName);
    const user = await UserModel.findOne({ username: decodedUsername });
    const email = user?.email;
    console.log(email);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }

    const isValidCode = user.verifyCode === code;
    const isCodeNotExpire = new Date(user.verifyCodeExpiry) > new Date();
    if (isValidCode && isCodeNotExpire) {
      user.isVerified = true;
      await user.save();
      await sendSuccessVerification(userName, email);
      return Response.json(
        {
          success: true,
          message: "Account verified",
        },
        { status: 200 }
      );
    } else if (!isValidCode) {
      return Response.json(
        {
          success: false,
          message: "Verify code does not matched",
        },
        { status: 405 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message:
            "Verify code has been expired please signup again to get a new  code",
        },
        { status: 405 }
      );
    }
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Error in verifying user",
      },
      { status: 500 }
    );
  }
}
