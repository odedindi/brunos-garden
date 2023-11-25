import { FC, PropsWithChildren } from "react"
import Jokes from "@/features/jokes"
import { AppShell, Box, Burger, Group } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import styled from "styled-components"
import { get } from "lodash"
import StrawberryLogo from "../StrawberryLogo"
import Authentication from "../authentication"

import { Slogen } from "./slogen"
import Sidebar from "./sidebar"

const Header = styled(AppShell.Header)`
  display: flex;
  align-items: center;
  padding: 0 8px;
  background-color: ${({ theme }) => get(theme, "colors.orange[3]")};
`

const Main = styled(AppShell.Main)`
  background-color: ${({ theme }) => get(theme, "colors.green[3]")};
`
const Footer = styled(AppShell.Footer)`
  background-color: ${({ theme }) => get(theme, "colors.blue[3]")};
  overflow: auto;
`

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const [navbarOpen, setNavbarOpen] = useLocalStorage({
    key: "navbar",
    defaultValue: true,
  })

  return (
    <AppShell
      header={{ height: 50 }}
      navbar={{
        width: 350,
        breakpoint: "sm",
        collapsed: { mobile: !navbarOpen },
      }}
      footer={{ height: 75 }}
      padding="md"
    >
      <Header>
        <Group w="100%" wrap="nowrap" pr="xl">
          <Box w="100%" style={{ display: "flex", alignItems: "center" }}>
            <Burger
              opened={navbarOpen}
              onClick={() => setNavbarOpen((o) => !o)}
              hiddenFrom="sm"
              size="sm"
            />
            <Authentication />
            <Slogen $hideUpToSm />
          </Box>
          <StrawberryLogo href="/" />
        </Group>
      </Header>

      <Sidebar />
      <Main bg={"green.3"}>{children}</Main>
      <Footer p="md" bg={"blue.3"} zIndex={1000}>
        <Jokes />
      </Footer>
    </AppShell>
  )
}
export default Layout
