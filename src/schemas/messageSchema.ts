import { z } from "zod";

export const messageValidation = z
  .string()
  .min(10, "Message must be of atleast 10 charcters")
  .max(300, "Message should not be more than three hundred words");
