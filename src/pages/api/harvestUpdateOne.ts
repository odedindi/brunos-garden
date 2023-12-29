import { z } from "zod"
import type { NextApiRequest, NextApiResponse } from "next"

import { getGoogleSheetApi } from "@/utils/getGoogleSheetApi"
import { getSheetId } from "@/utils/getSheetId"
import { HarvestSchema } from "@/types/Harvest"

type Data = string
const { GOOGLE_SPREADSHEET_ID } = process.env

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const sheets = await getGoogleSheetApi()

  try {
    const { email, harvest } = z
      .object({ email: z.string(), harvest: HarvestSchema })
      .parse(JSON.parse(req.body))

    const range = `${getSheetId(email)}${harvest.id}`

    try {
      const response = await sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SPREADSHEET_ID,
        range,
        valueInputOption: "RAW",
        requestBody: { values: [[JSON.stringify(harvest)]] },
      })

      if (response.data) return res.status(200).json(JSON.stringify(harvest.id))
      else return res.status(503).send("Error: Cannot confirm update success")
    } catch (e) {
      console.log({ error: e })
      return res.status(503).send(JSON.stringify(e))
    }
  } catch (e) {
    console.log(e)
    return res.status(503).send(JSON.stringify(e))
  }
}
