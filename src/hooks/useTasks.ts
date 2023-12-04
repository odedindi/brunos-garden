import { Task } from "@/types/Task"
import { useLocalStorage } from "@mantine/hooks"
import { useSession } from "next-auth/react"
import { useMemo } from "react"
import { useUpdateTasksMutation } from "./useUpdateTasksMutation"
import { useNewTaskMutation } from "./useNewTaskMutation"
import { useDeleteTaskMutation } from "./useDeleteTaskMutation"

const newTask = ({ title = "", description = "" }: Partial<Task>): Task => ({
  id: Math.random().toString(),
  title,
  description,
  attributes: [],
  tags: [],
  completed: false,
  schedule: null,
  category: null,
})

export const useTasks = () => {
  const userEmail = useSession().data?.user?.email

  const [tasksRaw] = useLocalStorage({
    key: "tasks",
    defaultValue: JSON.stringify([]),
  })
  const tasks: Task[] = useMemo(
    () => (!userEmail || !tasksRaw ? [] : JSON.parse(tasksRaw)),
    [tasksRaw, userEmail],
  )
  const { mutate: newTaskMutation, isPending: newTaskIsPending } =
    useNewTaskMutation()
  const { mutate: deleteTaskMutation } = useDeleteTaskMutation()
  const { mutate: updateTaskMutation } = useUpdateTasksMutation()

  const createTask = async () => {
    if (!userEmail || newTaskIsPending) return
    newTaskMutation({ email: userEmail, task: newTask({}) })
  }
  const updateTask = (task: Task) => {
    if (!userEmail) return
    updateTaskMutation({ email: userEmail, task })
  }
  const deleteTask = (taskId: string) => {
    if (!userEmail) return
    deleteTaskMutation({ email: userEmail, taskId })
  }

  return { tasks, createTask, updateTask, deleteTask }
}
