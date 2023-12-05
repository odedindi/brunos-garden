import { FC, useMemo, useRef } from "react"
import dayjs from "dayjs"
import { DateInput } from "@mantine/dates"
import { useDisclosure } from "@mantine/hooks"
import EditIcon from "@/ui/icons/Edit"

const ScheduleField: FC<{
  scheduled?: Date
  onChange: (date: Date | null) => void
}> = ({ scheduled: scheduled, onChange }) => {
  const [edit, { close, toggle }] = useDisclosure(false)
  const ref = useRef<HTMLInputElement>(null)

  const dateInputLabel = useMemo(() => {
    const daysDiff = dayjs(scheduled).diff(dayjs(), "days")
    const scheduledFor = !scheduled
      ? ""
      : daysDiff === 0
        ? "Today"
        : `${daysDiff > 0 ? "in" : ""} ${daysDiff} day${
            daysDiff < -1 ? "s" : ""
          } ${daysDiff < 0 ? "ago" : ""}`
    return `Scheduled: ${scheduledFor}`
  }, [scheduled])

  return (
    <DateInput
      ref={ref}
      disabled={!edit}
      size="xs"
      valueFormat="DD.MMM-YY"
      label={dateInputLabel}
      value={scheduled}
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
      onBlur={close}
    />
  )
}

export default ScheduleField
