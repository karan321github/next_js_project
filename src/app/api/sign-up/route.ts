import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import connectDB from "@/lib/connectDB";
import UserModel from "@/models/user";
import { bcrypt } from "bcrypt";

export async function POST(request: Request) {
  await connectDB();

  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByEmail = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByEmail) {
      return Response.json(
        {
          succcess: false,
          message: "Username is not available please try another one",
        },
        { status: 400 }
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 9000000).toString();
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User already exists with this email" },
          { status: 400 }
        );
      } else {
        const hashedPasword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPasword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.veryifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
      return Response.json(
        {
          success: false,
          message: " Username is not available please try another one",
        },
        { status: 400 }
      );
    } else {
      const hashedPasword = await bcrypt.has(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPasword,
        verifyCode,
        veryifyCodeExpiry: expiryDate,
        isAcceptMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in regestering user", error);
    return Response.json(
      {
        success: false,
        message: "Failed to register user",
      },
      { status: 500 }
    );
  }
}
