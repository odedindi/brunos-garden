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
    const { email, name, image } = z
      .object({
        email: z.string(),
        name: z.nullable(z.string()),
        image: z.nullable(z.string()),
      })
      .parse(JSON.parse(req.body))
    console.log({ email, name, image })

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
        requestBody: {
          values: [[JSON.stringify({ email, name, image })]],
        },
      })
      res
        .status(response.status)
        .json(JSON.stringify(response.data.updates?.updatedData?.values))
    } else res.status(newSheetReq.status).send(newSheetReq.statusText)
  } catch (e) {
    console.info(e)
    res.status(503).json(
      JSON.stringify({
        message: "could not parse params",
        error: e,
      }),
    )
  }
}
