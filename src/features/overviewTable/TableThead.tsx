import { flexRender, type Table as TanstackTable } from "@tanstack/react-table"
import type { FC } from "react"
import { Table, Title } from "@mantine/core"
import classes from "./overviewTable.module.css"
import cx from "clsx"
import ChevronIcon from "@/ui/icons/Chevron"
import { wideColumns } from "."
import type { HarvestFragmentFragment } from "generated/graphql"

type TableTheadProps = {
  table: TanstackTable<HarvestFragmentFragment>
}

const TableThead: FC<TableTheadProps> = ({ table }) => {
  return (
    <Table.Thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <Table.Tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const handleSort = () =>
              header.column.getToggleSortingHandler()?.(MouseEvent)
            return (
              <Table.Th
                key={header.id}
                className={cx(classes.textAlignCenter, {
                  [classes[
                    `column-${header.column.id}` as keyof typeof classes
                  ]]: !wideColumns.includes(header.column.id),
                  [classes.sortableColumnHeader]: header.column.getCanSort(),
                })}
              >
                {header.isPlaceholder ? null : (
                  <>
                    <Title
                      order={6}
                      onClick={handleSort}
                      className={cx({
                        [classes.columnHeaderTitle]:
                          header.column.id !== "select",
                      })}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}{" "}
                      {{
                        asc: <ChevronIcon up onClick={handleSort} />,
                        desc: <ChevronIcon down onClick={handleSort} />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </Title>
                  </>
                )}
              </Table.Th>
            )
          })}
        </Table.Tr>
      ))}
    </Table.Thead>
  )
}

export default TableThead
