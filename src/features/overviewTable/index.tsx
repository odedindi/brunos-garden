import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { FC, memo, useMemo, useState } from "react"
import { HarvestSchema, type Harvest } from "@/types/Harvest"
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
import { parseRawHarvest, useHarvests } from "@/hooks/useHarvests"
import { StringCell, NumberCell, DateCell } from "./overviewTableCells"
import cx from "clsx"

type OverviewProps = {
  harvests?: Harvest[]
  disableSelectRows?: boolean
  hideTableFoot?: boolean
  hideOverviewTableFooter?: boolean
  searchable?: boolean
  noDownloadCSV?: boolean
  isLoading?: boolean
}

const wideColumns = ["crop", "yield"]

const OverviewTable: FC<OverviewProps> = ({
  harvests: defaultHarvests,
  disableSelectRows,
  hideTableFoot,
  hideOverviewTableFooter,
  searchable,
  noDownloadCSV,
  isLoading,
}) => {
  const {
    harvests,
    isLoading: harvestsIsLoading,
    updateHarvest,
  } = useHarvests()
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
                    row.toggleSelected(!allRowsInPageSelected),
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
        cell: (info) => <DateCell {...info} />,
      },
      {
        id: "crop",
        header: "Crop",
        accessorKey: "crop",
        cell: StringCell,
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
        header: "weight (g)",
        accessorKey: "weight_g",
        cell: (info) => <NumberCell unit="g" {...info} />,

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
        header: "Area (m2)",
        accessorKey: "area_m2",
        cell: (info) => <NumberCell unit="m2" {...info} />,
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
    meta: {
      updateData: (rowIndex, columnId, value) => {
        const row = table.getCoreRowModel().rows[rowIndex]

        const parsedHarvest = parseRawHarvest(
          HarvestSchema.parse({
            ...row.original,
            [columnId]: value,
          }),
        )
        updateHarvest(parsedHarvest)
      },
    },
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

      {isLoading || (!defaultHarvests && harvestsIsLoading) ? (
        <Box style={{ margin: "auto", flex: 1, height: "100%" }}>
          <Loader color="dark.3" />
        </Box>
      ) : (
        <Table
          striped
          highlightOnHover
          withTableBorder
          style={{ boxShadow: "var(--mantine-shadow-sm)" }}
        >
          <Table.Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.Th
                    key={header.id}
                    className={cx(classes.textAlignCenter, {
                      [classes[
                        `column-${header.column.id}` as keyof typeof classes
                      ]]: !wideColumns.includes(header.column.id),
                    })}
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
              <Table.Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Td
                    key={cell.id}
                    className={cx(classes.textAlignCenter, {
                      [classes[
                        `column-${cell.column.id}` as keyof typeof classes
                      ]]: !wideColumns.includes(cell.column.id),
                    })}
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
                    <Table.Th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={classes.textAlignCenter}
                    >
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
