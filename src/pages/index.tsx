import { NextPage } from "next"
import dynamic from "next/dynamic"

import { useMemo } from "react"
import { useTasksQuery } from "@/hooks/useTasksQuery"
import Task from "@/features/taskList/task"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"

const Layout = dynamic(() => import("../ui/layout"), { ssr: false })

const HomePage: NextPage = () => {
  const { data: tasks } = useTasksQuery()
  const router = useRouter()
  const query = router.query as ParsedUrlQuery & { task: string }
  const activeTask = useMemo(() => {
    if (query.task) return tasks?.find(({ id }) => id === query.task)
  }, [query.task, tasks])

  return <Layout>{activeTask ? <Task task={activeTask} /> : null}</Layout>
}
export default HomePage
