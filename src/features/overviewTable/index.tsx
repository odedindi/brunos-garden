import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { FC, memo, useMemo, useState } from "react"
import type { Harvest } from "@/types/Harvest"
import {
  Box,
  Table,
  Flex,
  Text,
  Tooltip as MantineTooltip,
  Checkbox,
  Loader,
} from "@mantine/core"
import OverviewTableFooter from "./overviewTableFooter"
import OverviewTableSeach from "./overviewTableSeach"
import OverviewTableDeleteButton from "./overviewTableDeleteButton"
import OverviewTableDownloadCSV from "./overviewTableDownloadCSVButton"
import classes from "./overviewTable.module.css"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { useHarvests } from "@/hooks/useHarvests"

dayjs.extend(customParseFormat)

type OverviewProps = {
  harvests?: Harvest[]
  disableSelectRows?: boolean
  hideTableFoot?: boolean
  hideOverviewTableFooter?: boolean
  searchable?: boolean
  noDownloadCSV?: boolean
}

const wideColumns = ["crop", "yield"]

const OverviewTable: FC<OverviewProps> = ({
  harvests: defaultHarvests,
  disableSelectRows,
  hideTableFoot,
  hideOverviewTableFooter,
  searchable,
  noDownloadCSV,
}) => {
  const { harvests, isLoading: harvestsIsLoading } = useHarvests()
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  const columns = useMemo<ColumnDef<Harvest>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => {
          if (disableSelectRows) return null
          const { rows: pageRows } = table.getPaginationRowModel()
          const { rows: selectedRows } = table.getFilteredSelectedRowModel()
          const allRowsInPageSelected =
            !!pageRows.length && selectedRows.length === pageRows.length
          return (
            <Checkbox
              {...{
                checked: allRowsInPageSelected,
                indeterminate: !!selectedRows.length && !allRowsInPageSelected,
                onChange: () => {
                  pageRows.forEach((row) =>
                    row.toggleSelected(allRowsInPageSelected ? false : true),
                  )
                },
                color: "dark.3",
              }}
            />
          )
        },
        cell: ({ row }) =>
          disableSelectRows ? null : (
            <Checkbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                onChange: row.getToggleSelectedHandler(),
                color: "dark.3",
                pl: "sm",
              }}
            />
          ),
        footer: ({ table }) => {
          const { rows: selectedRows } = table.getFilteredSelectedRowModel()
          const { rows: allRows } = table.getPreFilteredRowModel()
          return (
            <Text>
              {selectedRows.length} of {allRows.length} Selected
            </Text>
          )
        },
      },
      {
        id: "date",
        header: "Date",
        accessorKey: "date",
        cell: (info) => {
          const value = info.getValue()
          if (typeof value === "string") return value.replace("_", " ")
          return value
        },
      },
      {
        id: "crop",
        header: "Crop",
        accessorKey: "crop",
        cell: (info) => info.getValue(),
        footer: ({ table }) => {
          const { rows: selectedRows } = table.getFilteredSelectedRowModel()
          const { rows: modelRows } = table.getFilteredRowModel()
          const rows = selectedRows.length ? selectedRows : modelRows
          const cropCount = Array.from(
            new Set(rows.map(({ original }) => original.crop)),
          ).length

          return (
            <>
              {cropCount} Crop{cropCount !== 1 ? "s" : ""}
            </>
          )
        },
      },

      {
        id: "area",
        header: "Area (m2)",
        accessorKey: "area_m2",
        cell: (info) => {
          const value = info.getValue<number>()
          return (
            <MantineTooltip openDelay={250} label={`${value} (m2)`}>
              <Text>{value}</Text>
            </MantineTooltip>
          )
        },
        footer: (props) => {
          const { rows: selectedRows } =
            props.table.getFilteredSelectedRowModel()
          const { rows: modelRows } = props.table.getFilteredRowModel()
          const rows = selectedRows.length ? selectedRows : modelRows
          const totalArea = rows.reduce<number>(
            (acc, { original: { area_m2 } }) => acc + area_m2,
            0,
          )
          return <>{totalArea}</>
        },
      },

      {
        id: "weight",
        header: "weight (g)",
        accessorKey: "weight_g",
        cell: (info) => {
          const value = info.getValue<number>()
          return (
            <MantineTooltip
              openDelay={250}
              label={`${value} (g) / ${value / 1000} (Kg)`}
            >
              <Text>{value}</Text>
            </MantineTooltip>
          )
        },
        footer: (props) => {
          const { rows: selectedRows } =
            props.table.getFilteredSelectedRowModel()
          const { rows: modelRows } = props.table.getFilteredRowModel()
          const rows = selectedRows.length ? selectedRows : modelRows
          const totalWeight = rows.reduce<number>(
            (acc, { original: { weight_g } }) => acc + weight_g,
            0,
          )
          return <>{totalWeight / 1000} (Kg)</>
        },
      },

      {
        id: "yield",
        accessorKey: "yield_Kg_m2",
        header: "Yield (Kg/m2)",
        cell: (info) => {
          const value = info.getValue<number>()
          return (
            <MantineTooltip openDelay={250} label={`${value} (Kg/m2)`}>
              <Text>{value?.toFixed(3)}</Text>
            </MantineTooltip>
          )
        },
        footer: (props) => {
          const { rows: selectedRows } =
            props.table.getFilteredSelectedRowModel()
          const { rows: modelRows } = props.table.getFilteredRowModel()
          const rows = selectedRows.length ? selectedRows : modelRows
          const totalYield = rows.reduce<number>(
            (acc, { original: { yield_Kg_m2 } }) => acc + yield_Kg_m2,
            0,
          )
          return <>{totalYield.toFixed(3)}</>
        },
      },
    ],
    [disableSelectRows],
  )
  const table = useReactTable({
    data: defaultHarvests ?? harvests ?? [],
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
        {disableSelectRows ? null : (
          <OverviewTableDeleteButton
            disabled={!defaultHarvests && harvestsIsLoading}
            table={table}
          />
        )}
        {noDownloadCSV ? null : (
          <OverviewTableDownloadCSV
            disabled={!defaultHarvests && harvestsIsLoading}
            table={table}
          />
        )}
      </Flex>

      {!defaultHarvests && harvestsIsLoading ? (
        <Box style={{ margin: "auto", flex: 1, height: "100%" }}>
          <Loader color="dark.3" />
        </Box>
      ) : (
        <Table
          striped
          highlightOnHover
          withTableBorder
          style={{ boxShadow: "var(--mantine-spacing-sm)" }}
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
      )}
      {hideOverviewTableFooter ? null : (
        <OverviewTableFooter pt="xl" table={table} />
      )}
    </Flex>
  )
}

export default memo(OverviewTable)
