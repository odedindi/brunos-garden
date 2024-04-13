import request from "graphql-request"
import { type TypedDocumentNode } from "@graphql-typed-document-node/core"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

const graphqlUrl =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/graphql`
    : "http://localhost:3000/api/graphql"

export const useGraphQL = <TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): UseQueryResult<TResult> =>
  useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [(document.definitions[0] as any).name.value, variables],
    queryFn: async ({ queryKey }) =>
      request(graphqlUrl, document, queryKey[1] ? queryKey[1] : undefined),
  })
