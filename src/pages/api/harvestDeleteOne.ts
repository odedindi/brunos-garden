import { z } from "zod"
import type { NextApiRequest, NextApiResponse } from "next"

import { getGoogleSheetApi } from "@/utils/getGoogleSheetApi"
import { getSheetId } from "@/utils/getSheetId"

type Data = string
const { GOOGLE_SPREADSHEET_ID } = process.env

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const sheets = await getGoogleSheetApi()

  try {
    const { email, harvestId } = z
      .object({ email: z.string(), harvestId: z.string() })
      .parse(JSON.parse(req.body))

    const range = `'${getSheetId(email)}'${harvestId}`

    try {
      const response = await sheets.spreadsheets.values.clear({
        spreadsheetId: GOOGLE_SPREADSHEET_ID,
        range,
      })
      if (response.data.clearedRange) {
        console.log(response.data.clearedRange)
        return res.status(200).send(harvestId)
      } else
        return res
          .status(503)
          .send("Error: Cannot confirm deleting harvest success")
    } catch (e) {
      console.error(e)
      return res.status(503).send(JSON.stringify(e))
    }
  } catch (e) {
    console.error(e)
    return res.status(503).send(JSON.stringify(e))
  }
}
