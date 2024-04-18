import { useSession } from "next-auth/react"
import { graphql, useFragment } from "generated"
import {
  invalidateGraphQLQuery,
  useGraphQLMutation,
  useGraphQLQuery,
} from "./useGraphQL"

export const HarvestFragment = graphql(/* GraphQL */ `
  fragment HarvestFragment on Harvest {
    __typename
    id
    crop
    date
    weight_g
    area_m2
    yield_Kg_m2
    createdAt
    updatedAt
    userEmail
  }
`)

const Me_Fragment = graphql(/* GraphQL */ `
  fragment MeFragment on User {
    __typename
    id
    email
    name
    image
    role
    harvests {
      ...HarvestFragment
    }
  }
`)

export const Me_Query = graphql(/* GraphQL */ `
  query Me {
    me {
      ...MeFragment
    }
  }
`)

const Add_User_Mutation = graphql(/* GraphQL */ `
  mutation AddUser($user: AddUserInput!) {
    addUser(user: $user) {
      ...MeFragment
    }
  }
`)

export const useMe = () => {
  const session = useSession()
  const { data, isLoading } = useGraphQLQuery(Me_Query, {
    enabled: !!session.data?.user?.email,
  })

  const {
    mutate,
    isPending,
    data: mutationData,
  } = useGraphQLMutation(Add_User_Mutation, {
    onSuccess: () => invalidateGraphQLQuery(Me_Query),
  })

  const me = useFragment(Me_Fragment, data?.me ?? mutationData?.addUser)
  const myHarvests = Array.from(
    useFragment(HarvestFragment, me?.harvests) ?? [],
  )

  if (
    !me &&
    !isLoading &&
    !!session.data?.user?.email &&
    !mutationData &&
    !isPending
  ) {
    console.log(
      `Authenticated user with email address ${session.data.user.email} not found in db, adding user`,
    )

    mutate({
      user: {
        email: session.data.user.email,
        name: session.data.user?.name,
        image: session.data.user?.image,
      },
    })
  }
  return {
    me: { ...me, harvests: myHarvests },
    isLoading: isLoading || session.status === "loading" || isPending,
  }
}
