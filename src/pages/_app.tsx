import { Providers } from "@/providers"
import type { AppProps } from "next/app"

import "@/config/general.css"
import "@/config/dayjsExtentions"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  )
}
