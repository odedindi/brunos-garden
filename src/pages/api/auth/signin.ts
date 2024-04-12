import { z } from "zod"
import type { NextApiRequest, NextApiResponse } from "next"
import { findUser, insertUser, InsertUserSchema, User } from "@/db/modules/user"
import { Harvest } from "@/db/modules/harvest"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./[...nextauth]"

type Data = User & { harvests: Harvest[] }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | string>,
) {
  try {
    const session = await getServerSession(req, res, authOptions)
    const { email, name } = InsertUserSchema.parse(session?.user)
    console.log("[api/auth/signin]: session user: ", { email, name })

    if (email) {
      const foundUser = await findUser(email)

      if (!foundUser) {
        console.log(
          "[api/auth/signin]: user not found in db, creating new user",
        )

        const [newUser] = await insertUser({ email, name })
        return res.status(200).json({ ...newUser, harvests: [] as Harvest[] })
      }

      return res.status(200).json(foundUser)
    }

    return res
      .status(503)
      .json("[api/auth/signin]: Error: no email found in session")
  } catch (e) {
    return res.status(503).json(JSON.stringify(e))
  }
}
