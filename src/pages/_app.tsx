import Providers from "@/providers"
import type { AppProps } from "next/app"

import "@/config/dayjsExtentions"
import "@/config/general.css"

import "mapbox-gl/dist/mapbox-gl.css"
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css"

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
