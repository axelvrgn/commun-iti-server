import { z } from "zod";

export const createRoomRequestSchema = z.strictObject({
  name: z.string().min(2),
});

export const roomParticipationSchema = z.strictObject({
  roomId: z.string().uuid(),
});

export const searchRoomRequestSchema = z.strictObject({
  name: z.string().min(1),
});

export const roomQueryByIdSchema = z.strictObject({
  id: z.string().uuid(),
});
