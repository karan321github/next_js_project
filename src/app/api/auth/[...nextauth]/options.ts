import connectDB from "@/lib/connectDB";
import UserModel from "@/models/user";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await connectDB();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.indetifier },
              { username: credentials.indetifier },
            ],
          });

          if (!user) {
            throw Error("No user find with this email");
          }

          if (!user.isVerified) {
            throw Error("Please verify your email before login");
          }

          const isPasswordCorrect = await bcrypt.compare(
            user.password,
            credentials.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw Error("Incorrect password");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
};
