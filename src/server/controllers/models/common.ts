import { z, transformer } from "zod";

export const paginationRequestSchema = z.object({
  page: z.string(),
  perPage: z.string(),
});

export type PaginationRequest = z.infer<typeof paginationRequestSchema>;
