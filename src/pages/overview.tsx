import { NextPage } from "next"
import dynamic from "next/dynamic"
import { useTasksQuery } from "@/hooks/useTasksQuery"
import Jokes from "@/features/jokes"

const Layout = dynamic(() => import("../ui/layout"), { ssr: false })
const OverviewTable = dynamic(() => import("@/features/overviewTable"), {
  ssr: false,
})

const OverviewPage: NextPage = () => {
  const { data: tasks } = useTasksQuery()

  return (
    <Layout headerProps={{ logoHref: "/" }} footer={<Jokes />}>
      <OverviewTable tasks={tasks} searchable />
    </Layout>
  )
}
export default OverviewPage
