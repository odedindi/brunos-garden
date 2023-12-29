import { invalidateQueries } from "@/providers/query"
import { User } from "@/types/User"
import { useMutation } from "@tanstack/react-query"

export const useUserCreateOneMutation = () =>
  useMutation({
    mutationKey: ["userCreateOne"],
    mutationFn: async (user: User) => {
      const res = await fetch("api/userCreateOne", {
        method: "POST",
        body: JSON.stringify(user),
      })
      const data = await res.json()
      return data
    },
    onSuccess: (_data, _variables, _context) => {
      invalidateQueries({ queryKey: ["me"] })
    },
  })
