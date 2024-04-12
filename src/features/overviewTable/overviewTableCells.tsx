// import type { Harvest } from "@/types/Harvest"
import { Input, NumberInput } from "@mantine/core"
import type { CellContext } from "@tanstack/react-table"
import { type FC, useEffect, useState, useRef } from "react"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { DateInput } from "@mantine/dates"
import dayjs from "dayjs"
import classes from "./overviewTable.module.css"
import { dateFormat } from "@/utils/parseDateStr"
import type { Harvest } from "@/db/modules/harvest"

// It is required to extend dayjs with customParseFormat plugin
// in order to parse dates with custom format
dayjs.extend(customParseFormat)

export const StringCell: FC<CellContext<Harvest, unknown>> = ({
  getValue,
  row,
  column,
  table: { options },
}) => {
  const initialValue = getValue<string>()
  const [value, setValue] = useState(initialValue)
  const ref = useRef<HTMLInputElement>(null)

  const onBlur = () => {
    options.meta?.updateData(row.index, column.id, value)
    ref.current?.blur()
  }
  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <Input
      ref={ref}
      className={classes.cellStringInput}
      variant="unstyled"
      title={value}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") onBlur()
        if (e.key === "Escape") {
          setValue(initialValue)
          setTimeout(() => ref.current?.blur())
        }
      }}
    />
  )
}

export const NumberCell: FC<
  CellContext<Harvest, unknown> & { unit: string; preventDecimal?: boolean }
> = ({ getValue, row, column, table: { options }, unit, preventDecimal }) => {
  const initialValue = getValue<number | string>()
  const [value, setValue] = useState(Number(initialValue))
  const ref = useRef<HTMLInputElement>(null)

  const onBlur = () => {
    options.meta?.updateData(row.index, column.id, value)
    ref.current?.blur()
  }
  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(Number(initialValue))
  }, [initialValue])

  return (
    <NumberInput
      ref={ref}
      className={classes.cellNumberInput}
      variant="unstyled"
      title={`${value} ${unit ? `(${unit})` : ""}`}
      value={value}
      onChange={(value) => setValue(Number(value))}
      onBlur={onBlur}
      onKeyDown={(e) => {
        if (preventDecimal && e.key === ".") e.preventDefault()
        if (e.key === "Enter") onBlur()
        if (e.key === "Escape") {
          setValue(Number(initialValue))
          setTimeout(() => ref.current?.blur())
        }
      }}
      step={1}
      thousandSeparator
      hideControls
    />
  )
}

export const DateCell: FC<CellContext<Harvest, unknown>> = ({
  getValue,
  row,
  column,
  table: { options },
}) => {
  const initialValue = getValue<Date>()
  const ref = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <DateInput
      ref={ref}
      className={classes.cellDateInput}
      variant="unstyled"
      title={dayjs(value).format("DD MMM YYYY")}
      valueFormat={dateFormat}
      value={value}
      onChange={(date) => {
        setValue(dayjs(date).toDate())
        options.meta?.updateData(
          row.index,
          column.id,
          dayjs(date).format(dateFormat),
        )
        ref.current?.blur()
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") ref.current?.blur()
      }}
    />
  )
}
