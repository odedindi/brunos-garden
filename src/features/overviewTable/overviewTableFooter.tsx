import type { Table as TanstackTable } from "@tanstack/react-table"
import type { FC } from "react"
import type { HarvestFragmentFragment } from "generated/graphql"
import {
  Box,
  BoxProps,
  Text,
  NumberInput,
  Select,
  Flex,
  FlexProps,
} from "@mantine/core"
import ChevronIcon from "@/ui/icons/Chevron"
import ChevronsIcon from "@/ui/icons/Chevrons"
import classes from "./overviewTable.module.css"

interface OverviewTableFooterProps extends FlexProps {
  table: TanstackTable<HarvestFragmentFragment>
}

const OverviewTableFooter: FC<OverviewTableFooterProps> = ({
  table,
  ...props
}) => (
  <Flex {...props}>
    <Box className={classes.footerInner}>
      <ChevronsIcon
        left
        size={36}
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      />
      <ChevronIcon
        left
        size={36}
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      />
      <ChevronIcon
        size={36}
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      />
      <ChevronsIcon
        size={36}
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      />

      <NumberInput
        className={classes.input}
        description="Page"
        title="Select page number"
        value={table.getState().pagination.pageIndex + 1}
        onChange={(value) => {
          const page = value ? Number(value) - 1 : 0
          table.setPageIndex(page)
        }}
        w={75}
        miw={50}
        disabled={table.getPageCount() === 1}
        min={table.getState().pagination.pageIndex}
        max={table.getPageCount()}
      />
    </Box>
    <Select
      className={classes.input}
      withCheckIcon={false}
      description="Results per page"
      title="Results per page"
      w={150}
      miw={50}
      value={`${table.getState().pagination.pageSize}`}
      onChange={(value) => {
        if (value) table.setPageSize(Number(value))
      }}
      data={[10, 20, 30, 40, 50].map((size) => `${size}`)}
    />
  </Flex>
)

export default OverviewTableFooter
