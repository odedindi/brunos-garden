import { z } from "zod"
import type { NextApiRequest, NextApiResponse } from "next"
import { getGoogleSheetApi } from "@/utils/getGoogleSheetApi"
import { getSheetId } from "@/utils/getSheetId"
import { UserSchema } from "@/types/User"

type Data = string
const { GOOGLE_SPREADSHEET_ID } = process.env

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const sheets = await getGoogleSheetApi()

  try {
    const user = UserSchema.parse(JSON.parse(req.body))
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SPREADSHEET_ID,
      range: `${getSheetId(user.email)}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [[JSON.stringify(user)]] },
    })
    return res.status(response.status).send(user.email)
  } catch (e) {
    console.info(e)
    return res.status(503).json(
      JSON.stringify({
        message: "could not parse params",
        error: e,
      }),
    )
  }
}
