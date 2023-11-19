import { FC, useMemo } from "react"
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
      disabled={!edit}
      size="xs"
      valueFormat="DD.MMM-YY"
      label={dateInputLabel}
      value={dayjs(scheduled).isValid() ? dayjs(scheduled).toDate() : undefined}
      onChange={(schedule) => onChange(schedule)}
      variant="filled"
      styles={{
        input: { padding: 0, cursor: "auto" },
        section: { width: "min-content" },
      }}
      rightSection={<EditIcon onClick={toggle} />}
    />
  )
}

export default ScheduleField
