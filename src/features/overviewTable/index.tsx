import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { FC, memo, useEffect, useMemo, useState } from "react"
import type { Task } from "@/types/Task"
import IndeterminateCheckbox from "./indeterminateCheckbox"

import { Box, Space, Table, Flex, Text, Tooltip } from "@mantine/core"
import OverviewTableFooter from "./overviewTableFooter"

import OverviewTableSeach from "./overviewTableSeach"
import OverviewTableDeleteButton from "./overviewTableDeleteButton"
import OverviewTableDownloadCSV from "./overviewTableDownloadCSVButton"

type OverviewProps = {
  tasks?: Partial<Task>[]
  disableSelectRows?: boolean
  hideTableFoot?: boolean
  hideOverviewTableFooter?: boolean
  searchable?: boolean
  noDownloadCSV?: boolean
}

const OverviewTable: FC<OverviewProps> = ({
  tasks,
  disableSelectRows,
  hideTableFoot,
  hideOverviewTableFooter,
  searchable,
  noDownloadCSV,
}) => {
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  const columns = useMemo<ColumnDef<Partial<Task>>[]>(
    () => [
      {
        id: "overviewTable",
        header: ({ table }) =>
          disableSelectRows ? null : (
            <IndeterminateCheckbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
                style: { marginLeft: "10px" },
              }}
            />
          ),
        cell: ({ row }) =>
          disableSelectRows ? null : (
            <Box px="xs">
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsSelected(),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler(),
                }}
              />
            </Box>
          ),
      },
      {
        header: "Id",
        accessorKey: "id",
        cell: (info) => info.getValue(),
        footer: (props) => null,
      },
      {
        header: "Crop",
        accessorKey: "title",
        cell: (info) => info.getValue(),
        footer: (props) => {
          const model = props.table.getFilteredRowModel()
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const cropCount = useMemo(
            () =>
              Array.from(
                new Set(model.rows.map(({ original: { title } }) => title)),
              ).length,
            [model.rows],
          )

          return (
            <Text size="xs">
              {cropCount} Crop{cropCount !== 1 ? "s" : ""}
            </Text>
          )
        },
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: (info) => {
          const value = info.getValue()
          if (typeof value === "string") return value.replace("_", " ")
          return value
        },
        footer: (props) => <>{/* props.column.id */}</>,
      },

      {
        header: "Yield (Kg/m2)",
        cell: (info) => {
          const { area = "", weight = "" } = info.row.original
          const [areaNum, areaUnit] = area.split("_")
          const [weightNum, weightUnit] = weight.split("_")
          const weightCorrected = weightNum
            ? weightUnit === "g"
              ? Number(weightNum) / 1000
              : Number(weightNum)
            : 0

          return (
            <Tooltip
              openDelay={500}
              label={`${weightCorrected} kg / ${areaNum} ${areaUnit}`}
            >
              <Text>{weightCorrected / Number(areaNum)}</Text>
            </Tooltip>
          )
        },
        footer: (props) => {
          const { rows } = props.table.getFilteredSelectedRowModel()

          console.log(rows)
          const totalYield = rows.reduce<number>(
            (acc, { original: { area = "", weight = "" } }) => {
              const [areaNum] = area.split("_")
              const [weightNum, weightUnit] = weight.split("_")
              const weightCorrected = weightNum
                ? weightUnit === "g"
                  ? Number(weightNum) / 1000
                  : Number(weightNum)
                : 0

              return acc + weightCorrected / Number(areaNum)
            },
            0,
          )
          return totalYield ? <>{totalYield}</> : null
        },
      },
    ],
    [disableSelectRows],
  )
  const table = useReactTable({
    data: tasks ?? [],
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  })

  useEffect(() => {
    table.getColumn("id")?.toggleVisibility(false)
  }, [table])

  return (
    <Flex direction="column" p={"sm"} justify="center">
      {searchable ? (
        <OverviewTableSeach
          value={globalFilter ?? ""}
          onChange={(value) => {
            setGlobalFilter(value)
            table.setGlobalFilter(value)
          }}
          onSubmit={(value) => {
            setGlobalFilter(value)
            table.setGlobalFilter(value)
          }}
        />
      ) : null}
      <Space h="lg" />
      <Flex w="100%" align="center" gap={2}>
        {Object.keys(rowSelection).length ? (
          <OverviewTableDeleteButton
            table={table}
            rowSelection={rowSelection}
          />
        ) : null}
        {noDownloadCSV ? null : <OverviewTableDownloadCSV table={table} />}
      </Flex>
      <Table
        striped
        highlightOnHover
        withTableBorder
        style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)" }}
      >
        <Table.Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </>
                  )}
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody>
          {table.getRowModel().rows.map((row) => (
            <Table.Tr
              key={row.id}
              onClick={() => row.toggleSelected()}
              style={{ cursor: "pointer" }}
            >
              {row.getVisibleCells().map((cell) => (
                <Table.Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
        {hideTableFoot ? null : (
          <Table.Tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <Table.Tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <Table.Th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext(),
                        )}
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Tfoot>
        )}
      </Table>

      <Space h="xl" />
      {hideOverviewTableFooter ? null : (
        <OverviewTableFooter table={table} rowSelection={rowSelection} />
      )}
    </Flex>
  )
}

export default memo(OverviewTable)
