import { z } from "zod"
import type { NextApiRequest, NextApiResponse } from "next"

import { getGoogleSheetApi } from "@/utils/getGoogleSheetApi"
import { getSheetId } from "@/utils/getSheetId"
import { db } from "@/db"

type Data = string
const { GOOGLE_SPREADSHEET_ID } = process.env

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const sheets = await getGoogleSheetApi()

  try {
    const { email } = z
      .object({ email: z.string() })
      .parse(JSON.parse(req.body))

    const range = getSheetId(email)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SPREADSHEET_ID,
      range,
    })

    if (response.data.values) {
      const tasks = response.data.values as [string[]]
      return res.status(200).json(JSON.stringify(tasks))
    }
    return res.status(503).json("Error: no data found on spreadsheet")
  } catch (e) {
    return res.status(503).json(JSON.stringify(e))
  }
}
