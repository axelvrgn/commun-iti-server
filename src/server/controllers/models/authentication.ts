import { z } from "zod";
import { uernameRegex } from "./user";

export const loginRequestSchema = z.strictObject({
  username: z.string().regex(uernameRegex),
  password: z.string(),
});
