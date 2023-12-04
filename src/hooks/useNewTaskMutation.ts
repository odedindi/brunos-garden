import { invalidateQueries } from "@/providers/query"
import { Task } from "@/types/Task"
import { useMutation } from "@tanstack/react-query"

export const useNewTaskMutation = () => {
  return useMutation({
    mutationKey: ["newTask"],
    mutationFn: async (body: { email: string; task: Task }) => {
      const res = await fetch("api/newTask", {
        method: "POST",
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const id = await res.text()
        return id
      } else {
        const error = await res.json()
        throw new Error(JSON.stringify(error))
      }
    },
    onSuccess: (_data, _variables, _context) => {
      invalidateQueries({ queryKey: ["tasks"] })
    },
  })
}
