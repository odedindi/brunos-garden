import { invalidateQueries } from "@/providers/query"
import { useMutation } from "@tanstack/react-query"

export const useHarvestsDeleteMutation = () =>
  useMutation({
    mutationKey: ["deleteHarvests"],
    mutationFn: async (body: { harvestIds: number[] }) => {
      const res = await fetch("api/auth/deleteHarvests", {
        method: "DELETE",
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error)
      }
      const deletedIds = (await res.json()) as {
        deletedId: number
        userEmail: string
      }[]
      return deletedIds
    },
    onSuccess: ([{ userEmail }], _variables, _context) => {
      invalidateQueries({ queryKey: ["me", userEmail] })
    },
  })
