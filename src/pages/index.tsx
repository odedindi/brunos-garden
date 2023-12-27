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
          width: "clamp(300px, 50%, 600px)",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Steps />
      </Box>
    </Layout>
  )
}
export default HomePage
