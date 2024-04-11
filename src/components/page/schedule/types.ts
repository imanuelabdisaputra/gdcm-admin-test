import { z, ZodType } from "zod"

export type FormData = {
  name: string;
  date: Date;
  startTime: string;
  endTime: string;
};

export const FormSchema: ZodType<FormData> = z
  .object({
    name: z.string().min(1, 'Required'),
    date: z.date(),
    startTime: z.string().min(1, 'Required'),
    endTime: z.string().min(1, 'Required'),
  })
