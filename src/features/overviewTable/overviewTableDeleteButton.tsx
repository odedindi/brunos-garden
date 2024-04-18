import type { Table as TanstackTable } from "@tanstack/react-table"

import type { FC } from "react"

import TrashIcon from "@/ui/icons/Trash"
import { useMe } from "@/hooks/useMe"
import type { HarvestFragmentFragment } from "generated/graphql"
import { useDeleteHarvests } from "@/hooks/useDeleteHarvest"

type OverviewTableDeleteButtonProps = {
  table: TanstackTable<HarvestFragmentFragment>
  disabled?: boolean
}

const OverviewTableDeleteButton: FC<OverviewTableDeleteButtonProps> = (
  props,
) => {
  const { me } = useMe()
  const { mutateAsync: deleteHarvests, isPending: deleteHarvestsIsPending } =
    useDeleteHarvests()

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
        const ids = selectedRows.map((row) => {
          props.table.setRowSelection({ [row.original.id]: false })
          return Number(row.original.id)
        })

        deleteHarvests({ ids })
      }}
      loading={deleteHarvestsIsPending}
    />
  )
}

export default OverviewTableDeleteButton
