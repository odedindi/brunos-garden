import { FC, PropsWithChildren } from "react";
import { StylesProvider } from "./styles";
import HeadProvider from "./head";

export const Providers: FC<PropsWithChildren> = ({ children }) => (
  <>
    <HeadProvider />
    <StylesProvider>{children}</StylesProvider>
  </>
);
