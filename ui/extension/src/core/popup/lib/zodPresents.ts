import { z } from "zod";

export const zodRequiredString = z.string().trim().min(1, { message: "Required" });
