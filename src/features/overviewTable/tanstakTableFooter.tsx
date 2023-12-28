import type { Table as TankstackTable } from "@tanstack/react-table"
import type { FC } from "react"
import type { Task } from "@/types/Task"

import { Box, Text, NumberInput, Select, Flex } from "@mantine/core"
import ChevronIcon from "@/ui/icons/Chevron"
import ChevronsIcon from "@/ui/icons/Chevrons"

type OverviewTableFooterProps = {
  table: TankstackTable<Partial<Task>>
  rowSelection: Object
}

const OverviewTableFooter: FC<OverviewTableFooterProps> = ({
  table,
  rowSelection,
}) => (
  <Box>
    <Flex>
      <Flex align={"center"} gap={"xs"} style={{ flex: 1 }}>
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
        <Text>Page</Text>
        <Text fw={700}>
          <NumberInput
            title="Go to page"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(value) => {
              const page = value ? Number(value) - 1 : 0
              table.setPageIndex(page)
            }}
            w={75}
            miw={50}
            disabled={table.getPageCount() === 1}
            styles={{
              input: {
                padding: "8px",
              },
            }}
            min={table.getState().pagination.pageIndex + 1}
            max={table.getPageCount()}
          />
        </Text>
      </Flex>
      <Select
        withCheckIcon={false}
        title="Rows per page"
        w={150}
        miw={50}
        value={`${table.getState().pagination.pageSize}`}
        onChange={(value) => {
          if (value) table.setPageSize(Number(value))
        }}
        data={[10, 20, 30, 40, 50].map((size) => `${size}`)}
      />
    </Flex>
    <hr />
    <Text>
      {Object.keys(rowSelection).length} of{" "}
      {table.getPreFilteredRowModel().rows.length} Total Rows Selected
    </Text>
  </Box>
)

export default OverviewTableFooter
