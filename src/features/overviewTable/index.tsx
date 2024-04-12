import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { FC, memo, useMemo, useState } from "react"
import {
  Box,
  Table,
  Flex,
  Grid,
  Text,
  Tooltip as MantineTooltip,
  Checkbox,
  Loader,
} from "@mantine/core"
import OverviewTableFooter from "./overviewTableFooter"
import OverviewTableSeach from "./overviewTableSeach"
import OverviewTableDeleteButton from "./overviewTableDeleteButton"
import OverviewTableDownloadCSV from "./overviewTableDownloadCSVButton"
import { StringCell, NumberCell, DateCell } from "./overviewTableCells"
import { parseDateStr } from "@/utils/parseDateStr"
import OverviewTableColumnsMenu from "./overviewTableColumnsMenu"
import TableTfoot from "./TableTfoot"
import TableTbody from "./TableTbody"
import TableThead from "./TableThead"
import { Harvest } from "@/db/modules/harvest"
import { useMe } from "@/hooks/useMe"
import { useHarvestUpdateMutation } from "@/hooks/useHarvestUpdateMutation"

type OverviewProps = {
  harvests?: Harvest[]
  disableSelectRows?: boolean
  hideTableFoot?: boolean
  hideOverviewTableFooter?: boolean
  searchable?: boolean
  noDownloadCSV?: boolean
  isLoading?: boolean
}

export const wideColumns = ["crop", "yield"]

const OverviewTable: FC<OverviewProps> = ({
  harvests: defaultHarvests,
  disableSelectRows,
  hideTableFoot,
  hideOverviewTableFooter,
  searchable,
  noDownloadCSV,
  isLoading,
}) => {
  const { me, isLoading: meIsLoading } = useMe()
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const { mutateAsync: updateHarvest, isPending: updateHarvestIsPending } =
    useHarvestUpdateMutation()
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
        accessorFn: (row) => parseDateStr(row.date, "YYYY-MM-DD"),
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
        cell: (info) => <NumberCell unit="g" preventDecimal {...info} />,

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
            (acc, { original: { area_m2 } }) => acc + Number(area_m2),
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
            (acc, { original: { yield_Kg_m2 } }) => acc + Number(yield_Kg_m2),
            0,
          )
          return <>{totalYield.toFixed(3)}</>
        },
      },
    ],
    [disableSelectRows],
  )
  const table = useReactTable({
    data: defaultHarvests ?? me?.harvests ?? [],
    columns,
    state: {
      rowSelection,
      sorting,
      columnVisibility,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,

    debugTable: true,
    meta: {
      updateData: async (rowIndex, columnId, value) => {
        const row = table.getCoreRowModel().rows[rowIndex]

        const updatedHarvest = {
          ...row.original,
          [columnId]: value,
        }

        console.log({ updatedHarvest })

        const res = await updateHarvest(updatedHarvest)
        console.log({ res })
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

      <Grid w="100%" align="center" py={"md"}>
        <Grid.Col span={11}>
          <Flex align="center" gap={"xs"} pl={"xs"}>
            {disableSelectRows ? null : (
              <OverviewTableDeleteButton
                disabled={!defaultHarvests && meIsLoading}
                table={table}
              />
            )}
            {noDownloadCSV ? null : (
              <OverviewTableDownloadCSV
                disabled={!defaultHarvests && meIsLoading}
                table={table}
              />
            )}
          </Flex>
        </Grid.Col>
        <Grid.Col span={1}>
          <OverviewTableColumnsMenu table={table} />
        </Grid.Col>
      </Grid>

      {isLoading || (!defaultHarvests && meIsLoading) ? (
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
          <TableThead table={table} />
          <TableTbody table={table} />
          {hideTableFoot ? null : <TableTfoot table={table} />}
        </Table>
      )}
      {hideOverviewTableFooter ? null : (
        <OverviewTableFooter pt="xl" table={table} />
      )}
    </Flex>
  )
}

export default memo(OverviewTable)
