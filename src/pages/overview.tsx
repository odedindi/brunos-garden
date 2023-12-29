import { NextPage } from "next"
import dynamic from "next/dynamic"
import { useHarvestsQuery } from "@/hooks/useHarvestsQuery"
import Jokes from "@/features/jokes"

const Layout = dynamic(() => import("../ui/layout"), { ssr: false })
const OverviewTable = dynamic(() => import("@/features/overviewTable"), {
  ssr: false,
})

const OverviewPage: NextPage = () => {
  const { data: harvests } = useHarvestsQuery()

  return (
    <Layout headerProps={{ logoHref: "/" }} footer={<Jokes />}>
      <OverviewTable harvests={harvests} searchable />
    </Layout>
  )
}
export default OverviewPage
