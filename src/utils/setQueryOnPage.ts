import { omit } from "lodash"
import { Url } from "next/dist/shared/lib/router/router"
import { NextRouter } from "next/router"

export const setQueryOnPage = (
  router: NextRouter,
  query: {
    [paramName: string]: string | string[] | number | number[] | never[]
  }, // pass [] (an empty array) as the query value to fully remove that query
) => {
  const url: Url = {
    pathname: router.pathname,
    query: { ...router.query, ...query },
  }

  const as: Url = {
    pathname: router.asPath?.split("?")[0],
    query: { ...omit(router.query, ["kitchenSlug", "slug"]), ...query },
  }

  router.replace(url, as, { shallow: true, scroll: false })
}
