import Layout from "@/ui/layout"
import { FC, useCallback, useMemo } from "react"

import dayjs from "dayjs"
import Task from "./task"
import type { Task as TTask } from "@/types/Task"
import { useLocalStorage } from "@uidotdev/usehooks"
import { ActionIcon, Tooltip } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"

const initalTasks: TTask[] = [
  {
    id: Math.random().toString().slice(0, 24),
    title: "Demo task",
    description: "the first task",
    schedule: dayjs().add(1, "day").toDate(),
    completed: false,
    attributes: [],
    tags: [],
  },
]
const TasksList: FC = () => {
  const [tasksRaw, setTasks] = useLocalStorage(
    "tasks",
    JSON.stringify(initalTasks),
  )
  const tasks: TTask[] = useMemo(
    () => (tasksRaw ? JSON.parse(tasksRaw) : []),
    [tasksRaw],
  )

  const createTask = useCallback(
    (task: TTask) => {
      const newTasks = [task, ...tasks]
      setTasks(JSON.stringify(newTasks))
    },
    [setTasks, tasks],
  )
  const updateTask = useCallback(
    (task: TTask) => {
      const taskIndex = tasks.findIndex(({ id }) => id === task.id)
      const newTasks = [...tasks]
      newTasks[taskIndex] = task
      setTasks(JSON.stringify(newTasks))
    },
    [setTasks, tasks],
  )
  const deleteTask = useCallback(
    (taskId: string) => {
      const newTasks = [...tasks.filter(({ id }) => id !== taskId)]
      setTasks(JSON.stringify(newTasks))
    },
    [setTasks, tasks],
  )
  return (
    <>
      <Tooltip label="New Task">
        <ActionIcon
          size="sm"
          onClick={() => {
            createTask({
              id: Math.random().toString(),
              title: "",
              description: "",
              attributes: [],
              tags: [],
            })
          }}
        >
          <IconPlus />
        </ActionIcon>
      </Tooltip>

      {tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          handle={{
            create: (newTask) => {
              createTask(newTask)
            },
            update: updateTask,
            delete: deleteTask,
          }}
        />
      ))}
    </>
  )
}

export default TasksList
