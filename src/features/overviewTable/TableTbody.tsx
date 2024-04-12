import { flexRender, type Table as TanstackTable } from "@tanstack/react-table"
import type { FC } from "react"
import type { Harvest } from "@/db/modules/harvest"
import { Table } from "@mantine/core"
import classes from "./overviewTable.module.css"
import cx from "clsx"
import { wideColumns } from "."

type TableTbodyProps = {
  table: TanstackTable<Harvest>
}

const TableTbody: FC<TableTbodyProps> = ({ table }) => {
  return (
    <Table.Tbody>
      {table.getRowModel().rows.map((row) => (
        <Table.Tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <Table.Td
              key={cell.id}
              className={cx(classes.textAlignCenter, {
                [classes[`column-${cell.column.id}` as keyof typeof classes]]:
                  !wideColumns.includes(cell.column.id),
              })}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Table.Td>
          ))}
        </Table.Tr>
      ))}
    </Table.Tbody>
  )
}

export default TableTbody
