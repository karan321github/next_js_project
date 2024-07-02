import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "Username must be more than of three words")
  .max(20, "Username cannot be more than twenty words")
  .regex(/^[a-zA-Z0-9_]+$/, "Username should not conatin special characters");

export const signUpSchemaValidation = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be of atleast 6 characters"),
});
