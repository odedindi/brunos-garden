import type { Table as TankstackTable } from "@tanstack/react-table"

import { FC } from "react"
import type { Harvest } from "@/types/Harvest"

import TrashIcon from "@/ui/icons/Trash"
import { useHarvestDeleteOnetMutation } from "@/hooks/useHarvesDeleteOnetMutation"
import { useMeQuery } from "@/hooks/useMe"

type OverviewTableDeleteButtonProps = {
  table: TankstackTable<Partial<Harvest>>
  rowSelection: Object
}

const OverviewTableDeleteButton: FC<OverviewTableDeleteButtonProps> = ({
  table,
  rowSelection,
}) => {
  const { data: me } = useMeQuery()
  const { mutate: deleteHarvest, isPending } = useHarvestDeleteOnetMutation()

  return (
    <TrashIcon
      size="md"
      bg="red.9"
      onClick={() => {
        if (!me) return
        const rowsSelected = Object.keys(rowSelection)
        const { rowsById } = table.getRowModel()
        for (const rowId of rowsSelected) {
          const row = rowsById[rowId]
          if (row.original.id)
            deleteHarvest({ email: me.email, harvestId: row.original.id })
        }
        rowsSelected.forEach((rowId) =>
          table.setRowSelection({ [rowId]: false }),
        )
      }}
      loading={isPending}
    />
  )
}

export default OverviewTableDeleteButton
