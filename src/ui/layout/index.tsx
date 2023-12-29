import { FC, PropsWithChildren, ReactNode } from "react"
import { AppShell, Box, Group } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
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
  headerProps?: {
    logoHref?: string
  }
  sidebar?: ReactNode
  footer?: ReactNode
}>
const Layout: FC<LayoutProps> = ({
  children,
  sidebar,
  footer,
  headerProps,
}) => {
  const [navbarOpen, setNavbarOpen] = useLocalStorage({
    key: "navbar",
    defaultValue: true,
  })

  return (
    <AppShell
      header={{ height: 50 }}
      navbar={
        sidebar
          ? {
              width: 350,
              breakpoint: "sm",
              collapsed: { mobile: !navbarOpen },
            }
          : undefined
      }
      footer={{ height: 75 }}
      padding="md"
    >
      <Header>
        <Group w="100%" wrap="nowrap" pr="xl">
          <Box w="100%" style={{ display: "flex", alignItems: "center" }}>
            <Authentication />
            <Slogen />
          </Box>
          <StrawberryLogo href={headerProps?.logoHref} />
        </Group>
      </Header>
      {sidebar ? sidebar : null}
      <Main>{children}</Main>
      {footer ? (
        <Footer p="md" zIndex={1000}>
          {footer}
        </Footer>
      ) : null}
    </AppShell>
  )
}
export default Layout
