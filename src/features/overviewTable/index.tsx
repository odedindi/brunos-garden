import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { FC, useMemo, useState } from "react"
import type { Task } from "@/types/Task"
import IndeterminateCheckbox from "./indeterminateCheckbox"

import {
  Box,
  Space,
  TextInput as MantineTextInput,
  Table,
  Flex,
} from "@mantine/core"
import OverviewTableFooter from "./TableFooter"
import styled from "styled-components"

const TextInput = styled(MantineTextInput)`
  :focus,
  :focus-within {
    border-color: var(--mantine-color-dark-3);
  }
`

type OverviewProps = {
  tasks?: Partial<Task>[]
  disableSelectRows?: boolean
}

const OverviewTable: FC<OverviewProps> = ({ tasks, disableSelectRows }) => {
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
        footer: (props) => props.column.id,
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: (info) => {
          const value = info.getValue()
          if (typeof value === "string") return value.replace("_", " ")
          return value
        },
        footer: (props) => props.column.id,
      },
      {
        header: "Weight",
        accessorKey: "weight",
        cell: (info) => {
          const value = info.getValue()
          if (typeof value === "string") return value.replace("_", " ")
          return value
        },
        footer: (props) => props.column.id,
      },
      {
        header: "Area",
        accessorKey: "area",
        cell: (info) => {
          const value = info.getValue()
          if (typeof value === "string") return value.replace("_", " ")
          return value
        },
        footer: (props) => props.column.id,
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

  return (
    <Flex direction="column" p={"sm"} justify="center">
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
      <Space h="lg" />

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
      </Table>

      <Space h="xl" />
      <OverviewTableFooter table={table} rowSelection={rowSelection} />
    </Flex>
  )
}

export default OverviewTable
