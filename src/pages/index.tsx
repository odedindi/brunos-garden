import { NextPage } from "next"
import dynamic from "next/dynamic"
import { Box } from "@mantine/core"

const Layout = dynamic(() => import("@/ui/layout"), { ssr: false })
const Steps = dynamic(() => import("@/features/steps"), { ssr: false })

const HomePage: NextPage = () => {
  return (
    <Layout headerProps={{ logoHref: "/overview" }}>
      <Box
        style={{
          width: "clamp(320px, 50vw, 800px)",
          margin: "auto",
        }}
      >
        <Steps />
      </Box>
    </Layout>
  )
}
export default HomePage
