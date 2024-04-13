import { schema } from "@/gql"
import { createYoga } from "graphql-yoga"
import type { NextApiRequest, NextApiResponse } from "next"
import { authOptions } from "./auth/[...nextauth]"
import { getServerSession } from "next-auth"

export const config = {
  api: { bodyParser: false }, // Disable body parsing (required for file uploads)
}

export default createYoga<{
  req: NextApiRequest
  res: NextApiResponse
}>({
  schema,
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: "/api/graphql",
  context: ({ req, res }) => ({
    session: getServerSession(req, res, authOptions),
  }),
})
