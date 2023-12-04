import { FC, useState } from "react"
import { Card, ScrollArea } from "@mantine/core"

import { Task } from "@/types/Task"
import { useRouter } from "next/router"
import { setQueryOnPage } from "@/utils/setQueryOnPage"
import { ParsedUrlQuery } from "querystring"
import dayjs from "dayjs"

const TasksList: FC<{ tasks: Task[] }> = ({ tasks }) => (
  <ScrollArea.Autosize h="100%" mt="xl" style={{ zIndex: 1 }} offsetScrollbars>
    {tasks.map((task) => (
      <TaskCard key={task.id} task={task} />
    ))}
  </ScrollArea.Autosize>
)

export default TasksList

const TaskCard: FC<{ task: Task }> = ({ task }) => {
  const router = useRouter()
  const query = router.query as ParsedUrlQuery & { task: string }
  const [isHovering, setIsHovering] = useState(false)

  const taskIsOverdue = task.schedule ? dayjs().isAfter(task.schedule) : false
  return (
    <Card
      mt="sm"
      style={{
        fontSize: query.task === task.id ? "18px" : "14px",
        fontWeight: 600,
        color: task.completed
          ? "lightgreen"
          : taskIsOverdue
            ? "red"
            : "inherit",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      shadow={isHovering ? "md" : undefined}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => setQueryOnPage(router, { task: task.id })}
    >
      {task.title}
    </Card>
  )
}
