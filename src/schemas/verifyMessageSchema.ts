import { z } from "zod";

export const verifyMessageValidation = z.object({
  code: z.string().min(6, "Verification code must be of 6 digits"),
});
