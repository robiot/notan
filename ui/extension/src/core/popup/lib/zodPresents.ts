import { z } from "zod";

export const zodRequiredString = z.string().trim().min(1, { message: "Required" });

export const zodPassword = z
  .string()
  .min(8, "Password must be more than 8 characters")
  .max(64, "Password must be less than 64 characters");
