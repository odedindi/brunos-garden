import type { Table as TanstackTable } from "@tanstack/react-table"

import type { FC } from "react"
import type { Harvest } from "@/types/Harvest"

import TrashIcon from "@/ui/icons/Trash"
import { useMe } from "@/hooks/useMe"
import { useHarvests } from "@/hooks/useHarvests"

type OverviewTableDeleteButtonProps = {
  table: TanstackTable<Harvest>
  disabled?: boolean
}

const OverviewTableDeleteButton: FC<OverviewTableDeleteButtonProps> = (
  props,
) => {
  const { me } = useMe()
  const { deleteHarvest, isPending } = useHarvests()

  const selectedRows = props.table.getFilteredSelectedRowModel().rows
  const disabled = props.disabled || !selectedRows.length || !me
  return (
    <TrashIcon
      size="md"
      disabled={disabled}
      bg={disabled ? "dark.1" : "red.9"}
      onClick={() => {
        if (!me) return
        const selectedRows = props.table.getFilteredSelectedRowModel().rows
        selectedRows.forEach((row) => {
          if (row.getIsSelected()) {
            const rowId = row.original.id
            props.table.setRowSelection({ [rowId]: false })
            deleteHarvest(rowId)
          }
        })
      }}
      loading={isPending}
    />
  )
}

export default OverviewTableDeleteButton
