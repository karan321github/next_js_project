import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import connectDB from "@/lib/connectDB";
import UserModel from "@/models/user";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await connectDB();

  try {
    //step 1 take user details from req
    const { username, email, password } = await request.json();
    //step - 2 check existingUser with username
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is not available please try another one",
        },
        { status: 400 }
      );
    }
    //step - 2 check existingUser with email
    const existingUserByEmail = await UserModel.findOne({ email });
    //make verifycode
    const verifyCode = Math.floor(100000 + Math.random() * 9000000).toString();
    //step -3 check if user is verified or not
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json(
          { success: false, message: "User already exists with this email" },
          { status: 400 }
        );
      } else {
        //step-4 if user is not exist then
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();

        return NextResponse.json(
          {
            success: true,
            message: "User registered successfully please verify your email",
          },
          { status: 201 }
        );
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
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
      return NextResponse.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in registering user", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to register user",
      },
      { status: 500 }
    );
  }
}
