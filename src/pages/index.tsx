import { NextPage } from "next"
import dynamic from "next/dynamic"
import { Box } from "@mantine/core"
import { ReactNode, useState } from "react"
import { AppShell, Group, Tabs as MantineTabs, Container } from "@mantine/core"
import classes from "../styles/layout.module.css"

import { useHarvests } from "@/hooks/useHarvests"

const Steps = dynamic(() => import("@/features/steps"), { ssr: false })
const OverviewTable = dynamic(() => import("@/features/overviewTable"), {
  ssr: false,
})
const Authentication = dynamic(() => import("@/ui/authentication"), {
  ssr: false,
})
const StrawberryLogo = dynamic(() => import("@/ui/StrawberryLogo"), {
  ssr: false,
})
const Slogen = dynamic(() => import("@/ui/slogen"), { ssr: false })
const Jokes = dynamic(() => import("@/features/jokes"), { ssr: false })

type Tab = {
  label: string
  view: ReactNode
  footer?: ReactNode
}

const HomePage: NextPage = () => {
  const [activeTab, setActiveTab] = useState(0)
  const { harvests } = useHarvests()

  const tabs: Tab[] = [
    {
      label: "Home",
      view: <Steps />,
    },
    {
      label: "Overview",
      view: <OverviewTable harvests={harvests} searchable />,
      footer: <Jokes />,
    },
  ]
  return (
    // <Layout headerProps={{ logoHref: "/overview" }}>
    // <Box
    //   style={{
    //     width: "clamp(320px, 50vw, 800px)",
    //     margin: "auto",
    //   }}
    // >
    //   <Steps />
    // </Box>
    // </Layout>
    <AppShell header={{ height: 115 }} footer={{ height: 75 }} padding="md">
      <AppShell.Header className={classes.header}>
        <Container pb="sm">
          <Group wrap="nowrap" justify="space-between">
            <Group wrap="nowrap">
              <Authentication />
              <Slogen />
            </Group>
            <StrawberryLogo />
          </Group>
        </Container>
        <Container>
          <MantineTabs
            value={tabs[activeTab]?.label}
            variant="outline"
            classNames={{
              root: classes.tabs,
              list: classes.tabsList,
              tab: classes.tab,
            }}
          >
            <MantineTabs.List>
              {tabs.map((tab, i) => (
                <MantineTabs.Tab
                  value={tab.label}
                  key={i}
                  onClick={() => {
                    setActiveTab(i)
                  }}
                >
                  {tab.label}
                </MantineTabs.Tab>
              ))}
            </MantineTabs.List>
          </MantineTabs>
        </Container>
      </AppShell.Header>
      <AppShell.Main className={classes.main}>
        {tabs[activeTab]?.view}
      </AppShell.Main>
      {tabs[activeTab]?.footer ? (
        <AppShell.Footer className={classes.footer} p="md" zIndex={1000}>
          {tabs[activeTab].footer}
        </AppShell.Footer>
      ) : null}
    </AppShell>
  )
}
export default HomePage
