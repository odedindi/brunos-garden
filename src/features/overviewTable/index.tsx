import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { FC, memo, useEffect, useMemo, useState } from "react"
import type { Harvest } from "@/types/Harvest"
import {
  Box,
  Table,
  Flex,
  Text,
  Tooltip as MantineTooltip,
  Checkbox,
} from "@mantine/core"
import OverviewTableFooter from "./overviewTableFooter"
import OverviewTableSeach from "./overviewTableSeach"
import OverviewTableDeleteButton from "./overviewTableDeleteButton"
import OverviewTableDownloadCSV from "./overviewTableDownloadCSVButton"
import classes from "./overviewTable.module.css"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)

type OverviewProps = {
  harvests?: Partial<Harvest>[]
  disableSelectRows?: boolean
  hideTableFoot?: boolean
  hideOverviewTableFooter?: boolean
  searchable?: boolean
  noDownloadCSV?: boolean
}

const wideColumns = ["crop", "yield"]

const OverviewTable: FC<OverviewProps> = ({
  harvests,
  disableSelectRows,
  hideTableFoot,
  hideOverviewTableFooter,
  searchable,
  noDownloadCSV,
}) => {
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  const columns = useMemo<ColumnDef<Partial<Harvest>>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) =>
          disableSelectRows ? null : (
            <Checkbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
                pl: "sm",
                color: "dark.3",
              }}
            />
          ),
        cell: ({ row }) =>
          disableSelectRows ? null : (
            <Box px="lg">
              <Checkbox
                {...{
                  checked: row.getIsSelected(),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler(),
                  color: "dark.3",
                }}
              />
            </Box>
          ),
      },
      // {
      //   header: "Id",
      //   accessorKey: "id",
      //   cell: (info) => info.getValue(),
      //   footer: (props) => null,
      // },
      {
        id: "date",
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
        id: "crop",
        header: "Crop",
        accessorKey: "crop",
        cell: (info) => info.getValue(),
        footer: (props) => {
          const model = props.table.getFilteredRowModel()
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const cropCount = useMemo(
            () =>
              Array.from(
                new Set(
                  model.rows.map(({ original: { crop: title } }) => title),
                ),
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
        id: "yield",
        header: "Yield (Kg/m2)",
        cell: (info) => {
          const { area = "", weight = "", harvest } = info.row.original

          if (harvest) {
            const [harvestNum, harvestUnit] = harvest.split("_")
            return (
              <MantineTooltip
                openDelay={500}
                label={`${harvestNum} ${harvestUnit}`}
              >
                <Text>{Number(harvestNum).toFixed(3)}</Text>
              </MantineTooltip>
            )
          }
          const [areaNum, areaUnit] = area.split("_")
          const [weightNum, weightUnit] = weight.split("_")
          const weightCorrected = weightNum
            ? weightUnit === "g"
              ? Number(weightNum) / 1000
              : Number(weightNum)
            : 0

          return (
            <MantineTooltip
              openDelay={500}
              label={`${weightCorrected} kg / ${areaNum} ${areaUnit}`}
            >
              <Text>{(weightCorrected / Number(areaNum)).toFixed(3)}</Text>
            </MantineTooltip>
          )
        },
        footer: (props) => {
          const { rows } = props.table.getFilteredSelectedRowModel()
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
    data: harvests ?? [],
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

  // useEffect(() => {
  //   table.getColumn("id")?.toggleVisibility(false)
  // }, [table])

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

      <Flex w="100%" align="center" gap={2} py={"md"}>
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
                <Table.Th
                  key={header.id}
                  className={
                    !wideColumns.includes(header.column.id)
                      ? classes[header.column.id as keyof typeof classes]
                      : undefined
                  }
                >
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
                <Table.Td
                  key={cell.id}
                  className={
                    !wideColumns.includes(cell.column.id)
                      ? classes[cell.column.id as keyof typeof classes]
                      : undefined
                  }
                >
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

      {hideOverviewTableFooter ? null : (
        <OverviewTableFooter
          pt="xl"
          table={table}
          rowSelection={rowSelection}
        />
      )}
    </Flex>
  )
}

export default memo(OverviewTable)
