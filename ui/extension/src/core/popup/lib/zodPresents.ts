import { z } from "zod";

export const zodRequiredString = z.string().trim().min(3, { message: "Required" });
