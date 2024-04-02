import type { Table as TankstackTable } from "@tanstack/react-table"
import type { FC } from "react"
import type { Harvest } from "@/types/Harvest"

import {
  Box,
  BoxProps,
  Text,
  NumberInput as MantineNumberInput,
  Select as MantineSelect,
  Flex,
} from "@mantine/core"
import ChevronIcon from "@/ui/icons/Chevron"
import ChevronsIcon from "@/ui/icons/Chevrons"
import styled from "styled-components"

const NumberInput = styled(MantineNumberInput)`
  :focus,
  :focus-within {
    border-color: var(--mantine-color-dark-3);
  }
`
const Select = styled(MantineSelect)`
  :focus,
  :focus-within {
    border-color: var(--mantine-color-dark-3);
  }
`

interface OverviewTableFooterProps extends BoxProps {
  table: TankstackTable<Partial<Harvest>>
  rowSelection: Object
}

const OverviewTableFooter: FC<OverviewTableFooterProps> = ({
  table,
  rowSelection,
  ...props
}) => (
  <Box {...props}>
    <Flex>
      <Flex align={"end"} style={{ flex: 1, gap: "4px" }}>
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
          description="Page"
          title="Select page number"
          defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={(value) => {
            const page = value ? Number(value) - 1 : 0
            table.setPageIndex(page)
          }}
          w={75}
          miw={50}
          disabled={table.getPageCount() === 1}
          styles={{ input: { padding: "8px", height: "37px" } }}
          min={table.getState().pagination.pageIndex + 1}
          max={table.getPageCount()}
        />
      </Flex>
      <Select
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
        styles={{ root: { borderColor: "red" } }}
      />
    </Flex>
    <hr style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)" }} />
    <Text>
      {Object.keys(rowSelection).length} of{" "}
      {table.getPreFilteredRowModel().rows.length} Selected
    </Text>
  </Box>
)

export default OverviewTableFooter
