import { z } from "zod";
import { paginationRequestSchema } from "./common";

export const sendMessageRequestSchema = z.strictObject({
  roomId: z.string().uuid(),
  text: z.strictObject({
    tokens: z.array(
      z.strictObject({
        value: z.string(),
        type: z.enum(["rich", "link", "mention"]),
      })
    ),
  }),
});

export type SendMessageRequest = z.infer<typeof sendMessageRequestSchema>;

export const setReactionRequestSchema = z.strictObject({
  messageId: z.string().uuid(),
  emoji: z.string().emoji(),
});

export const removeReactionRequestSchema = z.strictObject({
  messageId: z.string().uuid(),
  emoji: z.string().emoji(),
});

export type SetReactionRequest = z.infer<typeof setReactionRequestSchema>;
export const getMessagesRequestSchema = paginationRequestSchema.extend({
  roomId: z.string().uuid(),
});
