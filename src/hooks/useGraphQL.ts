import request from "graphql-request"
import type { TypedDocumentNode } from "@graphql-typed-document-node/core"
import {
  useMutation,
  useQuery,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query"
import { invalidateQueries } from "@/providers/query"

const extractDocumentName = <TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
) => (document.definitions[0] as any).name.value as string

export const invalidateGraphQLQuery = <TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables extends Record<string, never> ? undefined : TVariables,
): Promise<void> =>
  invalidateQueries({
    queryKey: [extractDocumentName(document), variables],
  })

const graphqlEndPoint =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/graphql`
    : "http://localhost:3000/api/graphql"

export const useGraphQLQuery = <TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  {
    variables,
    enabled,
  }: {
    variables?: TVariables extends Record<string, never>
      ? undefined
      : TVariables
    enabled?: boolean
  } = {},
): UseQueryResult<TResult, Error> =>
  useQuery<
    TResult,
    Error,
    TResult,
    readonly [documentName: string, TVariables | undefined]
  >({
    queryKey: [extractDocumentName(document), variables],
    queryFn: async () =>
      request(graphqlEndPoint, document, variables ?? undefined),
    enabled,
  })

export const useGraphQLMutation = <TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  {
    onSuccess,
  }: {
    onSuccess?: (
      data: TResult,
      variables: TVariables extends Record<string, never>
        ? undefined
        : TVariables,
    ) => void
  } = {},
): UseMutationResult<
  TResult,
  Error,
  TVariables extends Record<string, never> ? undefined : TVariables
> =>
  useMutation({
    mutationKey: [extractDocumentName(document)],
    mutationFn: async (variables) =>
      request(graphqlEndPoint, document, variables ?? undefined),
    onSuccess,
  })
