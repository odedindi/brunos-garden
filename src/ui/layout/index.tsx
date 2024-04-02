import { FC, PropsWithChildren, ReactNode } from "react"
import { AppShell, Box, Group } from "@mantine/core"
import StrawberryLogo from "../StrawberryLogo"
import Authentication from "../authentication"
import { Slogen } from "./slogen"
import classes from "./layout.module.css"

type LayoutProps = PropsWithChildren<{
  headerProps?: { logoHref?: string }
  footer?: ReactNode
}>
const Layout: FC<LayoutProps> = ({ children, footer, headerProps }) => (
  <AppShell header={{ height: 50 }} footer={{ height: 75 }} padding="md">
    <AppShell.Header className={classes.header}>
      <Group w="100%" wrap="nowrap" pr="xl">
        <Box w="100%" style={{ display: "flex", alignItems: "center" }}>
          <Authentication />
          <Slogen />
        </Box>
        <StrawberryLogo href={headerProps?.logoHref} />
      </Group>
    </AppShell.Header>
    <AppShell.Main className={classes.main}>{children}</AppShell.Main>
    {footer ? (
      <AppShell.Footer className={classes.footer} p="md" zIndex={1000}>
        {footer}
      </AppShell.Footer>
    ) : null}
  </AppShell>
)

export default Layout
