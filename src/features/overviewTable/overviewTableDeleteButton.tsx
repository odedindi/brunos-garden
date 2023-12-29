import type { Table as TankstackTable } from "@tanstack/react-table"

import { FC } from "react"
import type { Task } from "@/types/Task"

import TrashIcon from "@/ui/icons/Trash"
import { useDeleteTaskMutation } from "@/hooks/useDeleteTaskMutation"
import { useMeQuery } from "@/hooks/useMe"

type OverviewTableDeleteButtonProps = {
  table: TankstackTable<Partial<Task>>
  rowSelection: Object
}

const OverviewTableDeleteButton: FC<OverviewTableDeleteButtonProps> = ({
  table,
  rowSelection,
}) => {
  const { data: me } = useMeQuery()
  const { mutate: deleteCrop, isPending } = useDeleteTaskMutation()

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
            deleteCrop({ email: me.email, taskId: row.original.id })
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
