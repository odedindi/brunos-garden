import { z } from "zod"
import type { NextApiRequest, NextApiResponse } from "next"

import { getGoogleSheetApi } from "@/utils/getGoogleSheetApi"
import { getSheetId } from "@/utils/getSheetId"
import { TaskSchema } from "@/types/Task"

type Data = string
const { GOOGLE_SPREADSHEET_ID } = process.env

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const sheets = await getGoogleSheetApi()

  try {
    const { email, taskId } = z
      .object({ email: z.string(), taskId: z.string() })
      .parse(JSON.parse(req.body))

    const range = `'${getSheetId(email)}'${taskId}`

    try {
      const response = await sheets.spreadsheets.values.clear({
        spreadsheetId: GOOGLE_SPREADSHEET_ID,
        range,
      })
      if (response.data.clearedRange) {
        console.log(response.data.clearedRange)
        res.status(200).send(taskId)
      } else res.status(503).send("Error: Cannot confirm deleting task success")
    } catch (e) {
      console.log(e)
      res.status(503).send(JSON.stringify(e))
    }
  } catch (e) {
    console.log(e)
    res.status(503).send(JSON.stringify(e))
  }
}
