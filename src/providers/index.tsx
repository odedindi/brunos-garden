import { FC, PropsWithChildren } from "react"
import StylesProvider from "./styles"
import HeadProvider from "./head"
import AuthProvider from "./auth"
import { Session } from "next-auth"

export const Providers: FC<PropsWithChildren<{ session: Session }>> = ({
  children,
  session,
}) => (
  <AuthProvider session={session}>
    <HeadProvider />
    <StylesProvider>{children}</StylesProvider>
  </AuthProvider>
)

export default Providers
