import { FC, PropsWithChildren, ReactNode } from "react"
import { AppShell, Box, Group } from "@mantine/core"
import styled from "styled-components"
import { get } from "lodash"
import StrawberryLogo from "../StrawberryLogo"
import Authentication from "../authentication"

import { Slogen } from "./slogen"

const Header = styled(AppShell.Header)`
  display: flex;
  align-items: center;
  padding: 0 8px;
  background-color: ${({ theme }) => get(theme, "colors.gray[3]")};
  min-width: 320px;
`

const Main = styled(AppShell.Main)`
  min-width: 320px;
`
const Footer = styled(AppShell.Footer)`
  min-width: 320px;
  background-color: ${({ theme }) => get(theme, "colors.gray[3]")};
  overflow: auto;
`

type LayoutProps = PropsWithChildren<{
  headerProps?: { logoHref?: string }
  footer?: ReactNode
}>
const Layout: FC<LayoutProps> = ({ children, footer, headerProps }) => (
  <AppShell header={{ height: 50 }} footer={{ height: 75 }} padding="md">
    <Header>
      <Group w="100%" wrap="nowrap" pr="xl">
        <Box w="100%" style={{ display: "flex", alignItems: "center" }}>
          <Authentication />
          <Slogen />
        </Box>
        <StrawberryLogo href={headerProps?.logoHref} />
      </Group>
    </Header>
    <Main>{children}</Main>
    {footer ? (
      <Footer p="md" zIndex={1000}>
        {footer}
      </Footer>
    ) : null}
  </AppShell>
)

export default Layout
