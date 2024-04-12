import { invalidateQueries } from "@/providers/query"
import { Harvest, UpdateHarvestRequestBody } from "@/db/modules/harvest"
import { useMutation } from "@tanstack/react-query"

export const useHarvestUpdateMutation = () =>
  useMutation({
    mutationKey: ["harvestUpdateOne"],
    mutationFn: async (body: UpdateHarvestRequestBody) => {
      const res = await fetch("api/auth/updateHarvest", {
        method: "POST",
        body: JSON.stringify(body),
      })
      console.log("res", res)

      if (!res.ok) {
        const error = await res.json()
        throw new Error(JSON.stringify(error))
      }

      const harvest = (await res.json()) as Harvest
      return harvest
    },
    onSuccess: ({ userEmail }, _variables, _context) => {
      invalidateQueries({ queryKey: ["me", userEmail] })
    },
  })
