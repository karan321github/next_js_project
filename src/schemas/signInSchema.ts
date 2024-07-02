import { z } from "zod";

export const signInValidation = z.object({
  identifier: z.string(),
  passwrod: z.string(),
});
