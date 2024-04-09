import { invalidateQueries } from "@/providers/query"
import { User } from "@/types/User"
import { useMutation } from "@tanstack/react-query"

export const useUserUpdateOneMutation = () =>
  useMutation({
    mutationKey: ["userCreateOne"],
    mutationFn: async (user: User) => {
      const res = await fetch("api/userUpdateOne", {
        method: "POST",
        body: JSON.stringify(user),
      })
      const myEmail = await res.text()
      return myEmail
    },
    onSuccess: (_data, { email }, _context) => {
      invalidateQueries({ queryKey: ["me", email] })
    },
  })
