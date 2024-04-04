import customParseFormat from "dayjs/plugin/customParseFormat"
import dayjs from "dayjs"

// It is required to extend dayjs with customParseFormat plugin in order to parse dates with custom format
dayjs.extend(customParseFormat)

export const dateFormat = "DD-MM-YYYY"

export const parseDateStr = (
  dateStr: string | Date,
  format: string = dateFormat,
) => dayjs(dateStr, format).toDate()
