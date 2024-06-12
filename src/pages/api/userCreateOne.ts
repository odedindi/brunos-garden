import { z } from "zod"
import type { NextApiRequest, NextApiResponse } from "next"
import { getGoogleSheetApi } from "@/utils/getGoogleSheetApi"
import { getSheetId } from "@/utils/getSheetId"

type Data = string | any[][] | null | undefined
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
    console.log("[Create user spread sheet]: got body params: ", { email })

    const newSheetReq = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: GOOGLE_SPREADSHEET_ID,
      requestBody: {
        requests: [{ addSheet: { properties: { title: getSheetId(email) } } }],
      },
    })
    if (newSheetReq.status === 200) {
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: GOOGLE_SPREADSHEET_ID,
        range: getSheetId(email),
        includeValuesInResponse: true,
        valueInputOption: "RAW",
        // requestBody: {
        //   values: [[JSON.stringify({ email, name })]],
        // },
      })
      return res
        .status(response.status)
        .json(response.data.updates?.updatedData?.values)
    } else return res.status(newSheetReq.status).json(newSheetReq.statusText)
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
