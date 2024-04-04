import { flexRender, type Table as TanstackTable } from "@tanstack/react-table"
import type { FC } from "react"
import type { Harvest } from "@/types/Harvest"
import { Table } from "@mantine/core"
import classes from "./overviewTable.module.css"

type TableTfootProps = {
  table: TanstackTable<Harvest>
}

const TableTfoot: FC<TableTfootProps> = ({ table }) => (
  <Table.Tfoot>
    {table.getFooterGroups().map((footerGroup) => (
      <Table.Tr key={footerGroup.id}>
        {footerGroup.headers.map((header) => (
          <Table.Th
            key={header.id}
            colSpan={header.colSpan}
            className={classes.textAlignCenter}
          >
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.footer, header.getContext())}
          </Table.Th>
        ))}
      </Table.Tr>
    ))}
  </Table.Tfoot>
)

export default TableTfoot
