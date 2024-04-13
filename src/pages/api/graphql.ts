import { createYoga } from "graphql-yoga"
import type { NextApiRequest, NextApiResponse } from "next"
import { authOptions } from "./auth/[...nextauth]"
import { getServerSession } from "next-auth"
import { schema } from "@/db/schema"

export const config = {
  api: { bodyParser: false }, // Disable body parsing (required for file uploads)
}

export default createYoga<{
  req: NextApiRequest
  res: NextApiResponse
}>({
  schema,
  graphqlEndpoint: "/api/graphql",
  context: ({ req, res }) => ({
    session: getServerSession(req, res, authOptions),
  }),
})
