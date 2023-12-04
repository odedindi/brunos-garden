import dotenv from "dotenv"

dotenv.config({ override: true })

export const getSheetId = (email: string) =>
  process.env.NODE_ENV === "production"
    ? email
    : `${process.env.ENV_SHORT}-${email}`
