import { graphql } from "generated"
import { invalidateGraphQLQuery, useGraphQLMutation } from "./useGraphQL"
import { Me_Query } from "./useMe"

const Update_Harvest_Mutation = graphql(/* GraphQL */ `
  mutation UpdateHarvest($harvest: UpdateHarvestInput!) {
    updateHarvest(harvest: $harvest) {
      ...HarvestFragment
    }
  }
`)
export const useUpdateHarvest = () =>
  useGraphQLMutation(Update_Harvest_Mutation, {
    onSuccess: () => invalidateGraphQLQuery(Me_Query),
  })
