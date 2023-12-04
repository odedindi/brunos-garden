import { FC, PropsWithChildren } from "react"
import StylesProvider from "./styles"
import HeadProvider from "./head"
import AuthProvider from "./auth"
import { Session } from "next-auth"
import QueryProvider from "./query"

export const Providers: FC<PropsWithChildren<{ session: Session }>> = ({
  children,
  session,
}) => (
  <AuthProvider session={session}>
    <QueryProvider>
      <HeadProvider />
      <StylesProvider>{children}</StylesProvider>
    </QueryProvider>
  </AuthProvider>
)

export default Providers
