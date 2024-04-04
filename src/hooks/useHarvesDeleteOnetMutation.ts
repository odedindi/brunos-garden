import { invalidateQueries } from "@/providers/query"
import { useMutation } from "@tanstack/react-query"

export const useHarvestDeleteOnetMutation = () => {
  return useMutation({
    mutationKey: ["harvestDeleteOne"],
    mutationFn: async (body: { email: string; harvestId: string }) => {
      const res = await fetch("api/harvestDeleteOne", {
        method: "DELETE",
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(JSON.stringify(error))
      }
      return body.harvestId
    },
    onSuccess: (_data, { email }, _context) => {
      invalidateQueries({ queryKey: ["harvests", email] })
    },
  })
}
