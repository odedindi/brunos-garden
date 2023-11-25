import { invalidateQueries } from "@/providers/query"
import { Task } from "@/types/Task"
import { useMutation } from "@tanstack/react-query"

export const useUpdateTasksMutation = () =>
  useMutation({
    mutationKey: ["updateTask"],
    mutationFn: async (body: { email: string; task: Task }) => {
      console.log("updateing tasks", body)

      const res = await fetch("api/updateTask", {
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
    onSuccess: (_data, _variables, _context) => {
      invalidateQueries({ queryKey: ["tasks"] })
    },
  })
