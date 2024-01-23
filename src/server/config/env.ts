require("dotenv").config();
import { z } from "zod";

const configSchema = z.object({
  PORT: z
    .string()
    .regex(/^\d+$/)
    .default("3000")
    .transform((v) => +v),
  FILES_BASE_URL: z.string().url().default("http://localhost:3000/file"),
  AUTH_SECRET: z.string().default("4DA1E7A22EDE9FE29342726A9BD15"),
  DB_URL: z
    .string()
    .default("postgresql://user:pass@localhost:5432/commun-iti-db"),
  DB_NAME: z.string().default("commun-iti-db"),
});

export const SERVER_CONFIG = configSchema.parse(process.env);
