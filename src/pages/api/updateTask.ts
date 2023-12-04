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
    const { email, task } = z
      .object({ email: z.string(), task: TaskSchema })
      .parse(JSON.parse(req.body))

    const range = `${getSheetId(email)}${task.id}`

    try {
      const response = await sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SPREADSHEET_ID,
        range,
        valueInputOption: "RAW",
        requestBody: { values: [[JSON.stringify(task)]] },
      })

      if (response.data) res.status(200).json(JSON.stringify(task.id))
      else res.status(503).send("Error: Cannot confirm update success")
    } catch (e) {
      console.log({ error: e })
      res.status(503).send(JSON.stringify(e))
    }
  } catch (e) {
    console.log(e)
    res.status(503).send(JSON.stringify(e))
  }
}
