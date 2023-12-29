import { invalidateQueries } from "@/providers/query"
import { Harvest } from "@/types/Harvest"
import { useMutation } from "@tanstack/react-query"

export const useHarvestUpdateOneMutation = () =>
  useMutation({
    mutationKey: ["harvestUpdateOne"],
    mutationFn: async (body: { email: string; harvest: Harvest }) => {
      console.log("updateing harvest", body)

      const res = await fetch("api/harvestUpdateOne", {
        method: "POST",
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const data = await res.json()
        return data
      } else {
        const error = await res.json()
        throw new Error(JSON.stringify(error))
      }
    },
    onSuccess: (_data, { email }, _context) => {
      invalidateQueries({ queryKey: ["harvests", email] })
    },
  })
