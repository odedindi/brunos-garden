import Head from "next/head"
import { FC } from "react"

const title = "Bruno's Garden"
const HeadProvider: FC = () => (
  <Head>
    <title>{title}</title>
    <meta name="description" content="Manage your garden work" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <meta name="apple-mobile-web-app-title" content={title} />
    <link rel="icon" href="/favicon.ico" />
  </Head>
)

export default HeadProvider
