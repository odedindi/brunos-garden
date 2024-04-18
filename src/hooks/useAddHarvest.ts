import { graphql } from "generated"
import { invalidateGraphQLQuery, useGraphQLMutation } from "./useGraphQL"
import { Me_Query } from "./useMe"

const Add_Harvest_Mutation = graphql(/* GraphQL */ `
  mutation AddHarvest($harvest: AddHarvestInput!) {
    addHarvest(harvest: $harvest) {
      ...HarvestFragment
    }
  }
`)
export const useAddHarvest = () =>
  useGraphQLMutation(Add_Harvest_Mutation, {
    onSuccess: () => invalidateGraphQLQuery(Me_Query),
  })
