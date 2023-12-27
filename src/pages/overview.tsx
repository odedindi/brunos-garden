import { NextPage } from "next"
import dynamic from "next/dynamic"

import { useMemo, useState } from "react"
import { useTasksQuery } from "@/hooks/useTasksQuery"

import { Checkbox, Table } from "@mantine/core"
import { Task } from "@/types/Task"
import Jokes from "@/features/jokes"
import OverviewTable from "@/features/table"

const Layout = dynamic(() => import("../ui/layout"), { ssr: false })

const OverviewPage: NextPage = () => {
  const { data: tasks } = useTasksQuery()

  return (
    <Layout headerProps={{ logoHref: "/" }} footer={<Jokes />}>
      <OverviewTable tasks={tasks} />
    </Layout>
  )
}
export default OverviewPage
