import { Harvest, CreateHarvestRequestBody } from "@/db/modules/harvest"
import { invalidateQueries } from "@/providers/query"
import { useMutation } from "@tanstack/react-query"

export const useHarvestCreateMutation = () =>
  useMutation({
    mutationKey: ["createHarvest"],
    mutationFn: async (body: CreateHarvestRequestBody) => {
      const res = await fetch("api/auth/createHarvest", {
        method: "POST",
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error)
      }
      const harvest = (await res.json()) as Harvest
      return harvest
    },
    onSuccess: ({ userEmail }, _variables, _context) => {
      invalidateQueries({ queryKey: ["me", userEmail] })
    },
  })
