import { invalidateQueries } from "@/providers/query"
import { useMutation } from "@tanstack/react-query"

export const useDeleteTaskMutation = () => {
  return useMutation({
    mutationKey: ["deleteTask"],
    mutationFn: async (body: { email: string; taskId: string }) => {
      const res = await fetch("api/deleteTask", {
        method: "DELETE",
        body: JSON.stringify(body),
      })
      if (res.ok) return body.taskId
      else {
        const error = await res.json()
        throw new Error(JSON.stringify(error))
      }
    },
    onSuccess: (_data, _variables, _context) => {
      invalidateQueries({ queryKey: ["tasks"] })
    },
  })
}
