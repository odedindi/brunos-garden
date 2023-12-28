import Providers from "@/providers"
import type { AppProps } from "next/app"

import "@/config/dayjsExtentions"
import "@/config/general.css"

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
