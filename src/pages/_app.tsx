import Providers from "@/providers"
import type { AppProps } from "next/app"

import "@/config/general.css"
import "@/config/dayjsExtentions"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <Providers session={session}>
      <Component {...pageProps} />
    </Providers>
  )
}
