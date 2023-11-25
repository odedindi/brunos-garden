import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import * as dataIndex from "./utils/dataIndexes"
import { useLocalStorage } from "@mantine/hooks"
import { Task, TaskSchema } from "@/types/Task"

export const useTasksQuery = () => {
  const [_, setTasks] = useLocalStorage({ key: "tasks" })

  const { data: session } = useSession()
  const email = session?.user?.email
  return useQuery<Task[]>({
    queryKey: ["tasks", email],
    queryFn: async () => {
      const res = await fetch("api/sheet", {
        method: "POST",
        body: JSON.stringify({ email }),
      })
      const rawData = await res.json()
      const data: string[] = rawData ? JSON.parse(rawData) : []
      const tasksStr: string[] = data.length > 1 ? dataIndex.tasks(data) : []
      const tasks = tasksStr.map((str: string) =>
        TaskSchema.parse(JSON.parse(str)),
      )

      setTasks(JSON.stringify(tasks))
      return tasks
    },
    enabled: !!email,
  })
}
