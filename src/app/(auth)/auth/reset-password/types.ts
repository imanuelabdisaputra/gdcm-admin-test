import { z, ZodType } from "zod"

export type FormData = {
  password: string;
  confirmPassword: string;
};

export const FormSchema: ZodType<FormData> = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password is too short" })
      .max(20, { message: "Password is too long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
