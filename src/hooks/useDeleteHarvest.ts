import { graphql } from "generated"
import { invalidateGraphQLQuery, useGraphQLMutation } from "./useGraphQL"
import { Me_Query } from "./useMe"

const Delete_Harvests_Mutation = graphql(/* GraphQL */ `
  mutation DeleteHarvests($ids: [Int!]!) {
    deleteHarvests(ids: $ids) {
      ...HarvestFragment
    }
  }
`)
export const useDeleteHarvests = () =>
  useGraphQLMutation(Delete_Harvests_Mutation, {
    onSuccess: () => invalidateGraphQLQuery(Me_Query),
  })
