import dotenv from "dotenv"
dotenv.config({ override: true })

export const getSheetId = (email: string) => `${process.env.ENV_SHORT}-${email}`
