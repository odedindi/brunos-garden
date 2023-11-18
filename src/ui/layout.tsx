import { ArrowLeftIcon, CalendarIcon } from "@chakra-ui/icons";
import { Box, Grid, GridItem, Link } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";
import { Container } from "@chakra-ui/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import Jokes from "@/features/jokes";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const [navbarOpen, setNavbarOpen] = useLocalStorage("navbar", true);
  const templates = {
    wNav: `"header header" "nav main" "nav footer"`,
    woNav: `"header" "main" "footer"`,
  };
  const templateAreas = templates.woNav;
  return (
    <Grid
      templateAreas={templateAreas}
      gridTemplateRows={"50px 1fr 75px"}
      gridTemplateColumns={
        templateAreas === templates.wNav
          ? `${navbarOpen ? 200 : 75}px 1fr`
          : "1fr"
      }
      h="100vh"
      gap="1"
      color="blackAlpha.700"
      fontWeight="bold"
    >
      <GridItem pt="2" pl="2" bg="orange.300" area={"header"}>
        <Link href="/">
          {"Bruno's Garden"} <sub>BETA</sub>
        </Link>
      </GridItem>
      {templateAreas === templates.wNav ? (
        <GridItem pl="2" pr="2" bg="pink.300" area={"nav"}>
          <Container
            display="flex"
            justifyContent={navbarOpen ? "end" : "center"}
            alignItems="center"
            py="3"
            my="2"
          >
            <Box border="solid 1px" borderRadius="4" p="3">
              <ArrowLeftIcon
                cursor="pointer"
                onClick={() => setNavbarOpen((o) => !o)}
                rotate={`${navbarOpen ? 180 : 0}deg`}
                transform={`rotate(${navbarOpen ? 180 : 0}deg)`}
                animation="all 0.3s ease"
              />
            </Box>
          </Container>
          <Container
            display="flex"
            justifyContent={navbarOpen ? "start" : "center"}
            pt="2"
          >
            {navbarOpen ? "Table" : <CalendarIcon />}
          </Container>
        </GridItem>
      ) : null}
      <GridItem p="2" bg="green.300" area={"main"} overflow="scroll">
        {children}
      </GridItem>
      <GridItem px="2" bg="blue.300" area={"footer"}>
        <Jokes />
      </GridItem>
    </Grid>
  );
};

export default Layout;
