/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query Harvests($orderBy: OrderBy, $offset: Int, $limit: Int) {\n    harvests(orderBy: $orderBy, offset: $offset, limit: $limit) {\n      ...HarvestFragment\n    }\n  }\n": types.HarvestsDocument,
    "\n  mutation AddHarvest($harvest: AddHarvestInput!) {\n    addHarvest(harvest: $harvest) {\n      ...HarvestFragment\n    }\n  }\n": types.AddHarvestDocument,
    "\n  mutation DeleteHarvests($ids: [Int!]!) {\n    deleteHarvests(ids: $ids) {\n      ...HarvestFragment\n    }\n  }\n": types.DeleteHarvestsDocument,
    "\n  fragment HarvestFragment on Harvest {\n    __typename\n    id\n    crop\n    date\n    weight_g\n    area_m2\n    yield_Kg_m2\n    createdAt\n    updatedAt\n    userEmail\n  }\n": types.HarvestFragmentFragmentDoc,
    "\n  fragment MeFragment on User {\n    __typename\n    id\n    email\n    name\n    image\n    role\n    harvests {\n      ...HarvestFragment\n    }\n  }\n": types.MeFragmentFragmentDoc,
    "\n  query Me {\n    me {\n      ...MeFragment\n    }\n  }\n": types.MeDocument,
    "\n  mutation AddUser($user: AddUserInput!) {\n    addUser(user: $user) {\n      ...MeFragment\n    }\n  }\n": types.AddUserDocument,
    "\n  mutation UpdateHarvest($harvest: UpdateHarvestInput!) {\n    updateHarvest(harvest: $harvest) {\n      ...HarvestFragment\n    }\n  }\n": types.UpdateHarvestDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Harvests($orderBy: OrderBy, $offset: Int, $limit: Int) {\n    harvests(orderBy: $orderBy, offset: $offset, limit: $limit) {\n      ...HarvestFragment\n    }\n  }\n"): (typeof documents)["\n  query Harvests($orderBy: OrderBy, $offset: Int, $limit: Int) {\n    harvests(orderBy: $orderBy, offset: $offset, limit: $limit) {\n      ...HarvestFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddHarvest($harvest: AddHarvestInput!) {\n    addHarvest(harvest: $harvest) {\n      ...HarvestFragment\n    }\n  }\n"): (typeof documents)["\n  mutation AddHarvest($harvest: AddHarvestInput!) {\n    addHarvest(harvest: $harvest) {\n      ...HarvestFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteHarvests($ids: [Int!]!) {\n    deleteHarvests(ids: $ids) {\n      ...HarvestFragment\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteHarvests($ids: [Int!]!) {\n    deleteHarvests(ids: $ids) {\n      ...HarvestFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment HarvestFragment on Harvest {\n    __typename\n    id\n    crop\n    date\n    weight_g\n    area_m2\n    yield_Kg_m2\n    createdAt\n    updatedAt\n    userEmail\n  }\n"): (typeof documents)["\n  fragment HarvestFragment on Harvest {\n    __typename\n    id\n    crop\n    date\n    weight_g\n    area_m2\n    yield_Kg_m2\n    createdAt\n    updatedAt\n    userEmail\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MeFragment on User {\n    __typename\n    id\n    email\n    name\n    image\n    role\n    harvests {\n      ...HarvestFragment\n    }\n  }\n"): (typeof documents)["\n  fragment MeFragment on User {\n    __typename\n    id\n    email\n    name\n    image\n    role\n    harvests {\n      ...HarvestFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      ...MeFragment\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      ...MeFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddUser($user: AddUserInput!) {\n    addUser(user: $user) {\n      ...MeFragment\n    }\n  }\n"): (typeof documents)["\n  mutation AddUser($user: AddUserInput!) {\n    addUser(user: $user) {\n      ...MeFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateHarvest($harvest: UpdateHarvestInput!) {\n    updateHarvest(harvest: $harvest) {\n      ...HarvestFragment\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateHarvest($harvest: UpdateHarvestInput!) {\n    updateHarvest(harvest: $harvest) {\n      ...HarvestFragment\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;