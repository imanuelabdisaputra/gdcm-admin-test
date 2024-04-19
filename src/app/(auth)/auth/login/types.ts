import { z, ZodType } from "zod"

export type FormData = {
  email: string;
  password: string;
};

export const FormSchema: ZodType<FormData> = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "Password is too short" })
      .max(20, { message: "Password is too long" }),
  })

export const FormSchemaPhone: ZodType<{phone: string}> = z
  .object({
    phone: z.string().min(1, {
      message: 'Required'
    }),
  })
