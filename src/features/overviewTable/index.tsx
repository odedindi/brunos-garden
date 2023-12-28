import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { FC, memo, useMemo, useRef, useState } from "react"
import type { Task } from "@/types/Task"
import IndeterminateCheckbox from "./indeterminateCheckbox"

import {
  Box,
  Space,
  TextInput as MantineTextInput,
  Table,
  Flex,
  Text,
  Button,
} from "@mantine/core"
import OverviewTableFooter from "./overviewTableFooter"
import styled from "styled-components"
import { CSVLink } from "react-csv"
import dayjs from "dayjs"

const TextInput = styled(MantineTextInput)`
  :focus,
  :focus-within {
    border-color: var(--mantine-color-dark-3);
  }
`

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
        header: "Weight",
        accessorKey: "weight",
        cell: (info) => {
          const value = info.getValue()
          if (typeof value === "string") return value.replace("_", " ")
          return value
        },
        footer: (props) => {
          const model = props.table.getFilteredRowModel()
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const { sum, ave, unit } = useMemo(
            () =>
              model.rows.reduce<{
                sum: number
                ave: number
                unit?: string
              }>(
                ({ sum, unit }, { original: { weight } }, i) => {
                  const [weightNum, splittedUnit] = (weight ?? "").split("_")
                  const adjustedWeight = !weightNum
                    ? 0
                    : !unit || unit === splittedUnit
                      ? Number(weightNum)
                      : Number(
                          splittedUnit === "g"
                            ? Number(weightNum) * 1000
                            : Number(weightNum) / 1000,
                        )
                  const newSum = sum + adjustedWeight
                  return {
                    sum: newSum,
                    ave: Number((newSum / (i + 1)).toFixed(2)),
                    unit: unit ?? splittedUnit,
                  }
                },
                { sum: 0, ave: 0 },
              ),
            [model.rows],
          )

          return (
            <Flex direction="column">
              <Text size="xs">
                Sum:{" "}
                <strong>
                  {sum} {unit}
                </strong>
              </Text>
              <Text size="xs">
                Ave:{" "}
                <strong>
                  {ave} {unit}
                </strong>
              </Text>
            </Flex>
          )
        },
      },
      {
        header: "Area",
        accessorKey: "area",
        cell: (info) => {
          const value = info.getValue()
          if (typeof value === "string") return value.replace("_", " ")
          return value
        },
        footer: (props) => {
          const model = props.table.getFilteredRowModel()

          // eslint-disable-next-line react-hooks/rules-of-hooks
          const { sum, ave, unit } = useMemo(
            () =>
              model.rows.reduce<{
                sum: number
                ave: number
                unit?: string
              }>(
                ({ sum, unit }, { original: { area } }, i) => {
                  const [areaNum, splittedUnit] = (area ?? "").split("_")
                  const newSum = sum + (areaNum ? Number(areaNum) : 0)
                  return {
                    sum: newSum,
                    ave: newSum / (i + 1),
                    unit: unit ?? splittedUnit,
                  }
                },
                { sum: 0, ave: 0 },
              ),
            [model.rows],
          )

          return (
            <Flex direction="column">
              <Text size="xs">
                Sum:{" "}
                <strong>
                  {sum} {unit}
                </strong>
              </Text>
              <Text size="xs">
                Ave:{" "}
                <strong>
                  {ave} {unit}
                </strong>
              </Text>
            </Flex>
          )
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
  const [csvData, setCsvData] = useState<string[][]>([])
  const ref = useRef<CSVLink & HTMLAnchorElement>(null!)

  return (
    <Flex direction="column" p={"sm"} justify="center">
      {searchable ? (
        <Box>
          <TextInput
            value={globalFilter ?? ""}
            onChange={(e) => {
              setGlobalFilter(e.target.value)
              table.setGlobalFilter(e.target.value)
            }}
            style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)" }}
            onSubmit={(e) => {
              setGlobalFilter(e.currentTarget.value)
              table.setGlobalFilter(e.currentTarget.value)
            }}
            styles={{ input: { padding: "8px" } }}
            placeholder="Search..."
          />
        </Box>
      ) : null}
      <Space h="lg" />
      {noDownloadCSV ? null : (
        <Box>
          <Button
            size="xs"
            color="dark.3"
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
        </Box>
      )}
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
                      {/* {header.column.getCanFilter() ? (
                        <Box>
                          <Filter column={header.column} table={table} />
                        </Box>
                      ) : null} */}
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
