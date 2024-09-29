import connectDB from "@/lib/connectDB";
import UserModel from "@/models/user";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const userNameQuerySchema = z.object({
  username: usernameValidation,
});
export async function GET(request: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    //validate with zod
    const result = userNameQuerySchema.safeParse(queryParams);
    console.log(result);
    if (!result.success) {
      const userNameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            userNameErrors?.length > 0
              ? userNameErrors.join(",")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }
    const { username } = result.data;
    const verifiedUserExist = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (verifiedUserExist) {
      return Response.json(
        {
          Success: false,
          message:
            "User already exist with this username",
        },
        { status: 400 }
      );
    }
    return Response.json({
      success: true,
      message: "Username is available",
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Error in checking in username",
      },
      { status: 500 }
    );
  }
}
