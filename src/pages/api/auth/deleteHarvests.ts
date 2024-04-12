import { z } from "zod"
import type { NextApiRequest, NextApiResponse } from "next"
import { deleteHarvests } from "@/db/modules/harvest"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./[...nextauth]"

type Data = { deletedId: number; userEmail: string }[]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | string>,
) {
  try {
    const session = await getServerSession(req, res, authOptions)
    const { email, name } = z
      .object({ email: z.string(), name: z.string() })
      .parse(session?.user)

    console.log("[api/auth/deleteHarvests] session user: ", {
      user: { email, name },
    })

    const { harvestIds } = z
      .object({
        harvestIds: z.array(z.number()),
      })
      .parse(JSON.parse(req.body))
    console.log("[api/auth/deleteHarvests] got request body: ", {
      harvestIds,
    })

    if (email) {
      const deletedHarvests = await deleteHarvests(email, harvestIds)
      return res.status(200).json(deletedHarvests)
    }

    return res
      .status(503)
      .json("[api/auth/deleteHarvests] Error: no email found in request body")
  } catch (e) {
    return res.status(503).json(JSON.stringify(e))
  }
}
