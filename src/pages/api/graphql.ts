import { createYoga } from "graphql-yoga"
import type { NextApiRequest, NextApiResponse } from "next"
import { authOptions } from "./auth/[...nextauth]"
import { getServerSession } from "next-auth"
import { schema } from "@/db/schema"
import { db } from "@/db"
import { Role } from "generated/graphql"

export const config = {
  api: { bodyParser: false }, // Disable body parsing (required for file uploads)
}

export default createYoga<{
  req: NextApiRequest
  res: NextApiResponse
}>({
  schema,
  graphqlEndpoint: "/api/graphql",
  context: async ({ req, res }) => {
    const session = await getServerSession(req, res, authOptions)
    const user = session?.user?.email
      ? await db.query.users.findFirst({
          where: (user, { eq }) => eq(user.email, session!.user!.email!),
        })
      : undefined
    return {
      session,
      user,
      isAdmin: user?.role === Role.Admin,
    }
  },
})
