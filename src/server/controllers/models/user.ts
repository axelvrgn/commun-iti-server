import { z } from "zod";

export const uernameRegex =
  /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){1,18}[a-zA-Z0-9]$/;

export const registerUserRequestSchema = z.strictObject({
  username: z.string().regex(uernameRegex),
  password: z.string(),
});

export const updateUserRequestSchema = z.strictObject({
  username: z.string().regex(uernameRegex).optional(),
  picture: z.any().optional(),
});

export const userExistsRequestSchema = z.strictObject({
  username: z.string().regex(uernameRegex),
});
