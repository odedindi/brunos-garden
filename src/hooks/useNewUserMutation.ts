import { invalidateQueries } from "@/providers/query"
import { User } from "@/types/User"
import { useMutation } from "@tanstack/react-query"
export const useNewUserMutation = () =>
  useMutation({
    mutationKey: ["newUser"],
    mutationFn: async (user: User) => {
      const res = await fetch("api/newUser", {
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
