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

    const range = getSheetId(email)

    try {
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: GOOGLE_SPREADSHEET_ID,
        range,
        valueInputOption: "RAW",
        requestBody: { values: [[JSON.stringify(harvest)]] },
      })

      if (response.data.updates?.updatedRange) {
        const harvestId = response.data.updates?.updatedRange?.at(-1)!
        // update new id
        await sheets.spreadsheets.values.update({
          spreadsheetId: GOOGLE_SPREADSHEET_ID,
          range: `${range}!A${harvestId}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[JSON.stringify({ ...harvest, id: harvestId })]],
          },
        })
        return res.status(200).send(harvestId)
      } else
        return res
          .status(503)
          .send("Error: Cannot confirm creating new harvest success")
    } catch (e) {
      console.log(e)
      return res.status(503).send(JSON.stringify(e))
    }
  } catch (e) {
    console.log(e)
    return res.status(503).send(JSON.stringify(e))
  }
}
