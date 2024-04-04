import { invalidateQueries } from "@/providers/query"
import { Harvest } from "@/types/Harvest"
import { useMutation } from "@tanstack/react-query"

export const useHarvestCreateOne = () => {
  return useMutation({
    mutationKey: ["harvestCreateOne"],
    mutationFn: async (body: { email: string; harvest: Harvest }) => {
      const res = await fetch("api/harvestCreateOne", {
        method: "POST",
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(JSON.stringify(error))
      }
      const id = await res.text()
      return id
    },
    onSuccess: (_data, { email }, _context) => {
      invalidateQueries({ queryKey: ["harvests", email] })
    },
  })
}
