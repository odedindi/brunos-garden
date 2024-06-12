import { useDisclosure } from "@mantine/hooks"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import dynamic from "next/dynamic"

import { FC, PropsWithChildren, useEffect, Suspense } from "react"
const ReactQueryDevtoolsProduction = dynamic(() =>
  import("@tanstack/react-query-devtools/build/modern/production.js").then(
    (d) => ({
      default: d.ReactQueryDevtools,
    }),
  ),
)

const queryClient = new QueryClient()

type InvalidateQueries = typeof queryClient.invalidateQueries

export const invalidateQueries: InvalidateQueries = async (
  filters,
  options,
): Promise<void> => queryClient.invalidateQueries(filters, options)

const QueryProvider: FC<PropsWithChildren> = ({ children }) => {
  const [showDevtools, { toggle: toggleDevtools }] = useDisclosure(false)

  useEffect(() => {
    // @ts-ignore
    window.toggleDevtools = () => toggleDevtools()
  }, [toggleDevtools])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
      {showDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtoolsProduction initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  )
}

export default QueryProvider
