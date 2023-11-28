import { FC, useMemo, useRef } from "react"
import { Task as TTask } from "@/types/Task"
import dayjs from "dayjs"

import { DateInput } from "@mantine/dates"

import { useDisclosure } from "@mantine/hooks"
import EditIcon from "@/ui/icons/Edit"

const ScheduleField: FC<{
  scheduled?: TTask["schedule"]
  onChange: (date: Date | null) => void
}> = ({ scheduled: scheduled, onChange }) => {
  const [edit, { toggle }] = useDisclosure(false)
  const ref = useRef<HTMLInputElement>(null)

  const dateInputLabel = useMemo(() => {
    const isValid = dayjs(scheduled).isValid()
    if (!isValid) return undefined
    const daysDiff = dayjs(scheduled).diff(dayjs(), "days")
    return `Scheduled: ${
      daysDiff === 0
        ? "Today"
        : `${daysDiff > 0 ? "in" : ""} ${daysDiff} day${
            daysDiff < -1 ? "s" : ""
          } ${daysDiff < 0 ? "ago" : ""}`
    }`
  }, [scheduled])

  return (
    <DateInput
      ref={ref}
      disabled={!edit}
      size="xs"
      valueFormat="DD.MMM-YY"
      label={dateInputLabel}
      value={dayjs(scheduled).isValid() ? dayjs(scheduled).toDate() : undefined}
      onChange={(schedule) => onChange(schedule)}
      variant="filled"
      styles={{
        input: {
          padding: "0 8px",
          cursor: "auto",
          border: edit ? "solid 1px purple" : undefined,
        },
        section: { width: "min-content", padding: "0 3px" },
      }}
      rightSection={
        <EditIcon
          onClick={() => {
            if (!edit) setTimeout(() => ref.current?.focus())
            toggle()
          }}
          bg={edit ? "grape" : undefined}
          size="sm"
        />
      }
    />
  )
}

export default ScheduleField
