import { FC, useRef, useState } from "react"
import { DatePicker, DateValue } from "@mantine/dates"
import { ParsedUrlQuery } from "querystring"
import { setQueryOnPage } from "@/utils/setQueryOnPage"
import dayjs from "dayjs"
import { useRouter } from "next/router"
import { useFocusOnLoad } from "@/hooks/useFocusOnLoad"

interface Query extends ParsedUrlQuery {
  date?: string
}

export const dateFormat = "DD-MM-YYYY"

const SelectDate: FC<{
  onSubmit?: () => void
}> = ({ onSubmit }) => {
  const ref = useRef<HTMLDivElement>(null)
  useFocusOnLoad(ref, (ref) => {
    if (ref?.current) {
      const levelGroup = ref.current.querySelector<HTMLDivElement>(
        ".mantine-DatePicker-levelsGroup",
      )

      if (levelGroup) {
        levelGroup.scrollTop = levelGroup.scrollHeight
      }

      const selectedEl = Array.from(
        ref.current.querySelectorAll<HTMLDivElement>(".mantine-DatePicker-day"),
      ).find((el) => el.getAttribute("data-selected") === "true")

      if (selectedEl) {
        selectedEl.focus()
      }
    }
  })

  const router = useRouter()
  const query = router.query as Query

  const queryToState = (date: string) =>
    dayjs(date).isValid() ? dayjs(date, dateFormat).toDate() : null

  const onChange = (date: DateValue) =>
    setQueryOnPage(router, {
      date: date ? dayjs(date).format(dateFormat) : null,
    })

  const [state, setState] = useState<DateValue>(() => {
    if (!query.date) {
      const newState = new Date() //[new Date(), null] as DateValue
      onChange(newState)
      return newState
    }
    return queryToState(query.date)
  })

  return (
    <DatePicker
      ref={ref}
      type="default"
      value={state}
      onChange={(date) => {
        setState(date)
        onChange(date)
      }}
      size="lg"
      onSubmit={() => {
        if (onSubmit) onSubmit()
      }}
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
