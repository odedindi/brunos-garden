import { FC, useRef, useState } from "react"
import { DatePicker, DatesRangeValue } from "@mantine/dates"
import { ParsedUrlQuery } from "querystring"
import { setQueryOnPage } from "@/utils/setQueryOnPage"
import dayjs from "dayjs"
import { useRouter } from "next/router"
import { useFocusOnLoad } from "@/hooks/useFocusOnLoad"

type Query = ParsedUrlQuery & {
  date?: string
}

export const dateFormat = "DD-MM-YYYY"

const SelectDate: FC<{
  onSubmit?: () => void
}> = ({ onSubmit }) => {
  const ref = useRef<HTMLDivElement>(null)
  useFocusOnLoad(ref, (ref) => {
    if (ref?.current) {
      const datePicketEl = Array.from(
        ref.current.querySelectorAll<HTMLDivElement>(".mantine-DatePicker-day"),
      ).find((el) => el.getAttribute("data-selected") === "true")
      if (datePicketEl) {
        datePicketEl.focus()
      }
    }
  })

  const router = useRouter()
  const query = router.query as Query

  const queryToState = (dateStr: string) => {
    const [date1, date2] = dateStr.split("_")
    return [
      date1 ? dayjs(date1, dateFormat).toDate() : null,
      date2 ? dayjs(date2, dateFormat).toDate() : null,
    ] as DatesRangeValue
  }
  const onChange = (date: DatesRangeValue) => {
    const [date1, date2] = date.filter(Boolean)
    setQueryOnPage(router, {
      date:
        date1 && date2
          ? dayjs(date1).isSame(dayjs(date2), "day")
            ? dayjs(date1).format(dateFormat)
            : dayjs(date1).isBefore(dayjs(date2), "day")
              ? `${dayjs(date1).format(dateFormat)}${
                  date2 ? `_${dayjs(date2).format(dateFormat)}` : ""
                }`
              : `${dayjs(date2).format(dateFormat)}_${dayjs(date1).format(
                  dateFormat,
                )}`
          : date1
            ? dayjs(date1).format(dateFormat)
            : date2
              ? dayjs(date2).format(dateFormat)
              : [],
    })
  }
  const [state, setState] = useState<DatesRangeValue>(() => {
    if (!query.date) {
      const newState = [new Date(), null] as DatesRangeValue
      onChange(newState)
      return newState
    }
    return queryToState(query.date)
  })

  return (
    <DatePicker
      ref={ref}
      type="range"
      value={state}
      onChange={(date) => {
        setState(date)
        onChange(date)
      }}
      allowSingleDateInRange
      size="lg"
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          if (onSubmit) onSubmit()
        }
      }}
      style={{ margin: "auto" }}
    />
  )
}
export default SelectDate
