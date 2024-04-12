import { z } from "zod"
import type { NextApiRequest, NextApiResponse } from "next"
import {
  Harvest,
  insertHarvest,
  CreateHarvestRequestBodySchema,
} from "@/db/modules/harvest"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./[...nextauth]"
import { InsertUserSchema } from "@/db/modules/user"

type Data = Harvest

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | string>,
) {
  try {
    const session = await getServerSession(req, res, authOptions)
    const { email, name } = InsertUserSchema.parse(session?.user)
    console.log("[api/auth/createHarvest]: session user: ", { email, name })

    const harvest = CreateHarvestRequestBodySchema.parse(JSON.parse(req.body))

    console.log("[api/auth/createHarvest]: got request body: ", {
      harvest,
    })

    if (email) {
      const [createdHarvest] = await insertHarvest({
        ...harvest,
        userEmail: email,
      })
      return res.status(200).json(createdHarvest)
    }

    return res
      .status(503)
      .json("[api/auth/createHarvest]: Error: no email found in request body")
  } catch (e) {
    return res.status(503).json(JSON.stringify(e))
  }
}
