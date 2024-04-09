import { NextPage } from "next"
import dynamic from "next/dynamic"
import { ReactNode } from "react"
import {
  AppShell,
  Group,
  Tabs as MantineTabs,
  Container,
  Box,
} from "@mantine/core"
import classes from "../styles/layout.module.css"

import { ParsedUrlQuery } from "querystring"
import { useRouter } from "next/router"
import { setQueryOnPage } from "@/utils/setQueryOnPage"

const Steps = dynamic(() => import("@/features/steps"), { ssr: false })
const OverviewTable = dynamic(() => import("@/features/overviewTable"), {
  ssr: false,
})
const Map = dynamic(() => import("@/features/map"), { ssr: false })
const Authentication = dynamic(() => import("@/ui/authentication"), {
  ssr: false,
})
const StrawberryLogo = dynamic(() => import("@/ui/StrawberryLogo"), {
  ssr: false,
})
const Slogen = dynamic(() => import("@/ui/slogen"), { ssr: false })
const Jokes = dynamic(() => import("@/features/jokes"), { ssr: false })

interface Query extends ParsedUrlQuery {
  tab?: string
}

type Tab = {
  id: string
  label: string
  view: ReactNode
  footer?: ReactNode
}

const tabs: Tab[] = [
  {
    id: "0",
    label: "Home",
    view: (
      <Box className={classes.contentWrapper}>
        <Steps />
      </Box>
    ),
  },
  {
    id: "1",
    label: "Overview",
    view: (
      <Box className={classes.contentWrapper}>
        <OverviewTable searchable />
      </Box>
    ),
    footer: <Jokes />,
  },
  { id: "2", label: "Map", view: <Map /> },
]

const HomePage: NextPage = () => {
  const router = useRouter()
  const query = router.query as Query

  const activeTabID =
    !!query.tab && tabs.map(({ id }) => id).includes(query.tab)
      ? query.tab
      : tabs[0].id

  const activeTab = tabs.find((t) => t.id === activeTabID)
  return (
    <AppShell header={{ height: 120 }} footer={{ height: 90 }} padding="md">
      <AppShell.Header className={classes.header}>
        <Container pb="lg">
          <Group wrap="nowrap" justify="flex-end">
            <StrawberryLogo />
            <Slogen />
          </Group>
        </Container>
        <Container>
          <MantineTabs
            value={activeTabID}
            variant="outline"
            classNames={{
              root: classes.tabs,
              list: classes.tabsList,
              tab: classes.tab,
            }}
          >
            <MantineTabs.List>
              <Group w="100%" wrap="nowrap">
                <Group flex={1} wrap="nowrap">
                  {tabs.map((tab, i) => (
                    <MantineTabs.Tab
                      value={tab.id}
                      key={tab.id}
                      onClick={() => setQueryOnPage(router, { tab: tab.id })}
                    >
                      {tab.label}
                    </MantineTabs.Tab>
                  ))}
                </Group>
                <Authentication />
              </Group>
            </MantineTabs.List>
          </MantineTabs>
        </Container>
      </AppShell.Header>
      <AppShell.Main className={classes.main}>{activeTab?.view}</AppShell.Main>
      {activeTab?.footer ? (
        <AppShell.Footer className={classes.footer} p="md" zIndex={1000}>
          {activeTab?.footer}
        </AppShell.Footer>
      ) : null}
    </AppShell>
  )
}
export default HomePage
