import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { FC, PropsWithChildren } from "react"

const AuthProvider: FC<PropsWithChildren<{ session: Session }>> = ({
  children,
  session,
}) => <SessionProvider session={session}>{children}</SessionProvider>

export default AuthProvider
