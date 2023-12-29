import type { Table as TankstackTable } from "@tanstack/react-table"

import { FC, useRef, useState } from "react"
import type { Task } from "@/types/Task"

import { Button } from "@mantine/core"
import { CSVLink } from "react-csv"
import dayjs from "dayjs"

type OverviewTableDownloadCSVProps = {
  table: TankstackTable<Partial<Task>>
}

const OverviewTableDownloadCSV: FC<OverviewTableDownloadCSVProps> = ({
  table,
}) => {
  const [csvData, setCsvData] = useState<string[][]>([])
  const ref = useRef<CSVLink & HTMLAnchorElement>(null!)

  return (
    <Button
      size="xs"
      color="dark.3"
      h={28}
      onClick={() => {
        const [{ headers }] = table.getHeaderGroups()
        const colNames = headers.slice(1).map(({ id }) => id)

        const { rows } = table.getRowModel()
        const data = rows.map(({ original }) => original)
        const dataCsvFormat: string[][] = [
          colNames,
          ...data.map((crop) =>
            colNames.map((colName) => crop[colName as keyof Task] ?? ""),
          ),
        ]
        setCsvData(dataCsvFormat)
        setTimeout(() => {
          if (ref.current.click) ref.current.click() // a hack to make the CSVLink download the updated date
        })
      }}
    >
      <CSVLink
        ref={ref}
        data={csvData}
        filename={`brunos-garden${dayjs().format("MMHHDDMMYY")}.csv`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        Download CSV
      </CSVLink>
    </Button>
  )
}

export default OverviewTableDownloadCSV
