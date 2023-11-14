import { FC, PropsWithChildren } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";
import { theme } from "@/config/theme";

export const StylesProvider: FC<PropsWithChildren> = ({ children }) => (
  <CacheProvider>
    <ChakraProvider resetCSS theme={theme}>
      {children}
    </ChakraProvider>
  </CacheProvider>
);
