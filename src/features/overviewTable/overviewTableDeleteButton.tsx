import type { Table as TanstackTable } from "@tanstack/react-table"

import type { FC } from "react"
import type { Harvest } from "@/db/modules/harvest"

import TrashIcon from "@/ui/icons/Trash"
import { useMe } from "@/hooks/useMe"
import { useHarvestsDeleteMutation } from "@/hooks/useHarvestsDeleteMutation"

type OverviewTableDeleteButtonProps = {
  table: TanstackTable<Harvest>
  disabled?: boolean
}

const OverviewTableDeleteButton: FC<OverviewTableDeleteButtonProps> = (
  props,
) => {
  const { me } = useMe()
  const { mutateAsync: deleteHarvests, isPending: deleteHarvestsIsPending } =
    useHarvestsDeleteMutation()

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
        const harvestIds = selectedRows.map((row) => {
          props.table.setRowSelection({ [row.original.id]: false })
          return Number(row.original.id)
        })

        deleteHarvests({ harvestIds })
      }}
      loading={deleteHarvestsIsPending}
    />
  )
}

export default OverviewTableDeleteButton
