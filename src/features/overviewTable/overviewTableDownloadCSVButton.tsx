import type { Table as TankstackTable } from "@tanstack/react-table"

import { FC, useRef, useState } from "react"
import type { Harvest } from "@/types/Harvest"

import { Button } from "@mantine/core"
import { CSVLink } from "react-csv"
import dayjs from "dayjs"
import classes from "./overviewTable.module.css"

type OverviewTableDownloadCSVProps = {
  table: TankstackTable<Harvest>
  disabled?: boolean
}

const OverviewTableDownloadCSV: FC<OverviewTableDownloadCSVProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [csvData, setCsvData] = useState<(string | number)[][]>([])
  const ref = useRef<CSVLink & HTMLAnchorElement>(null!)
  const disabled = props.disabled || loading
  return (
    <Button
      size="xs"
      color={disabled ? "dark.1" : "dark.3"}
      disabled={disabled}
      onClick={() => {
        if (loading) return
        setLoading(true)
        const { rows } = props.table.getRowModel()

        const columns = new Set<string>()
        const data = rows.map(({ original }) => {
          Object.keys(original).forEach((key) => columns.add(key))
          return original
        })

        const cols = Array.from(columns)
        const dataCsvFormat: (string | number)[][] = [
          cols,
          ...data.map((crop) =>
            cols.map((colName) => crop[colName as keyof Harvest] ?? ""),
          ),
        ]

        setCsvData(dataCsvFormat)
        setTimeout(
          () => {
            ref.current?.click?.()
          }, // a hack to make the CSVLink download the updated date
        )
        setLoading(false)
      }}
      disabled={loading}
      loading={loading}
    >
      <CSVLink
        ref={ref}
        data={csvData}
        filename={`brunos-garden${dayjs().format("MMHHDDMMYY")}.csv`}
        className={classes.csvLink}
      >
        Download CSV
      </CSVLink>
    </Button>
  )
}

export default OverviewTableDownloadCSV
