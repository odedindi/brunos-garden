import { z } from "zod"

export const UserSchema = z.object({
  email: z.string(),
  name: z.nullable(z.string()),
  image: z.nullable(z.string()),
})

export type User = z.infer<typeof UserSchema>
