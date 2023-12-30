import { NextPage } from "next"
import dynamic from "next/dynamic"
import Jokes from "@/features/jokes"
import { useHarvests } from "@/hooks/useHarvests"

const Layout = dynamic(() => import("../ui/layout"), { ssr: false })
const OverviewTable = dynamic(() => import("@/features/overviewTable"), {
  ssr: false,
})
const OverviewChart = dynamic(() => import("@/features/overviewChart"), {
  ssr: false,
})

const OverviewPage: NextPage = () => {
  const { harvests } = useHarvests()
  return (
    <Layout headerProps={{ logoHref: "/" }} footer={<Jokes />}>
      {harvests ? <OverviewChart harvests={harvests} /> : null}
      <OverviewTable harvests={harvests} searchable />
    </Layout>
  )
}
export default OverviewPage
