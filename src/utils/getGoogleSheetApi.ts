import { google } from "googleapis"

export const getGoogleSheetApi = async () => {
  const auth = await google.auth.getClient({
    credentials: {
      project_id: process.env.project_id,
      private_key: process.env.private_key,
      client_email: process.env.client_email,
      client_id: process.env.client_id,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  const sheets = google.sheets({ version: "v4", auth })

  return sheets
}
