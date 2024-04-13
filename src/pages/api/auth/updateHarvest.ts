import type { NextApiRequest, NextApiResponse } from "next"
import {
  Harvest,
  updateharvest,
  UpdateHarvestRequestBodySchema,
} from "@/db/modules/harvest"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./[...nextauth]"
import { InsertUserSchema } from "@/db/modules/user/schema"

type Data = Harvest

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | string>,
) {
  try {
    const session = await getServerSession(req, res, authOptions)
    const { email, name } = InsertUserSchema.parse(session?.user)
    console.log("[api/auth/updateHarvest]: session user: ", { email, name })

    const harvest = UpdateHarvestRequestBodySchema.parse(JSON.parse(req.body))

    console.log("[api/auth/updateHarvest]: got request body: ", {
      harvest,
    })

    if (email === harvest.userEmail) {
      const [createdHarvest] = await updateharvest(harvest)
      return res.status(200).json(createdHarvest)
    }

    return res
      .status(503)
      .json(
        "[api/auth/updateHarvest]: Error: session email does not match request body email",
      )
  } catch (e) {
    return res.status(503).json(JSON.stringify(e))
  }
}
