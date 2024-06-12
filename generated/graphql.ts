/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type AddHarvestInput = {
  area_m2: Scalars['String']['input'];
  crop: Scalars['String']['input'];
  date: Scalars['String']['input'];
  weight_g: Scalars['Int']['input'];
  yield_Kg_m2: Scalars['String']['input'];
};

export type AddUserInput = {
  email: Scalars['String']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Harvest = {
  __typename?: 'Harvest';
  area_m2: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  crop: Scalars['String']['output'];
  date: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  updatedAt: Scalars['Date']['output'];
  userEmail: Scalars['String']['output'];
  weight_g: Scalars['Int']['output'];
  yield_Kg_m2: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addHarvest: Harvest;
  addUser: User;
  deleteHarvests: Array<Harvest>;
  removeUser: User;
  updateHarvest: Harvest;
  updateUser: User;
};


export type MutationAddHarvestArgs = {
  harvest: AddHarvestInput;
};


export type MutationAddUserArgs = {
  user: AddUserInput;
};


export type MutationDeleteHarvestsArgs = {
  ids: Array<Scalars['Int']['input']>;
};


export type MutationRemoveUserArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUpdateHarvestArgs = {
  harvest: UpdateHarvestInput;
};


export type MutationUpdateUserArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export enum OrderBy {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  getUser?: Maybe<User>;
  getUsers: Array<User>;
  harvest?: Maybe<Harvest>;
  harvests: Array<Harvest>;
  me?: Maybe<User>;
};


export type QueryGetUserArgs = {
  email: Scalars['String']['input'];
};


export type QueryGetUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OrderBy>;
};


export type QueryHarvestArgs = {
  id: Scalars['Int']['input'];
};


export type QueryHarvestsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OrderBy>;
};

export enum Role {
  Admin = 'admin',
  User = 'user'
}

export type UpdateHarvestInput = {
  area_m2?: InputMaybe<Scalars['String']['input']>;
  crop?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  weight_g?: InputMaybe<Scalars['Int']['input']>;
  yield_Kg_m2?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt?: Maybe<Scalars['Date']['output']>;
  email: Scalars['String']['output'];
  harvests: Array<Harvest>;
  id: Scalars['Int']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role: Role;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};


export type UserHarvestsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OrderBy>;
};

export type HarvestsQueryVariables = Exact<{
  orderBy?: InputMaybe<OrderBy>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type HarvestsQuery = { __typename?: 'Query', harvests: Array<(
    { __typename?: 'Harvest' }
    & { ' $fragmentRefs'?: { 'HarvestFragmentFragment': HarvestFragmentFragment } }
  )> };

export type AddHarvestMutationVariables = Exact<{
  harvest: AddHarvestInput;
}>;


export type AddHarvestMutation = { __typename?: 'Mutation', addHarvest: (
    { __typename?: 'Harvest' }
    & { ' $fragmentRefs'?: { 'HarvestFragmentFragment': HarvestFragmentFragment } }
  ) };

export type DeleteHarvestsMutationVariables = Exact<{
  ids: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
}>;


export type DeleteHarvestsMutation = { __typename?: 'Mutation', deleteHarvests: Array<(
    { __typename?: 'Harvest' }
    & { ' $fragmentRefs'?: { 'HarvestFragmentFragment': HarvestFragmentFragment } }
  )> };

export type HarvestFragmentFragment = { __typename: 'Harvest', id: number, crop: string, date: string, weight_g: number, area_m2: string, yield_Kg_m2: string, createdAt: any, updatedAt: any, userEmail: string } & { ' $fragmentName'?: 'HarvestFragmentFragment' };

export type MeFragmentFragment = { __typename: 'User', id: number, email: string, name?: string | null, image?: string | null, role: Role, harvests: Array<(
    { __typename?: 'Harvest' }
    & { ' $fragmentRefs'?: { 'HarvestFragmentFragment': HarvestFragmentFragment } }
  )> } & { ' $fragmentName'?: 'MeFragmentFragment' };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'MeFragmentFragment': MeFragmentFragment } }
  ) | null };

export type AddUserMutationVariables = Exact<{
  user: AddUserInput;
}>;


export type AddUserMutation = { __typename?: 'Mutation', addUser: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'MeFragmentFragment': MeFragmentFragment } }
  ) };

export type UpdateHarvestMutationVariables = Exact<{
  harvest: UpdateHarvestInput;
}>;


export type UpdateHarvestMutation = { __typename?: 'Mutation', updateHarvest: (
    { __typename?: 'Harvest' }
    & { ' $fragmentRefs'?: { 'HarvestFragmentFragment': HarvestFragmentFragment } }
  ) };

export const HarvestFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HarvestFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Harvest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"crop"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"weight_g"}},{"kind":"Field","name":{"kind":"Name","value":"area_m2"}},{"kind":"Field","name":{"kind":"Name","value":"yield_Kg_m2"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}}]}}]} as unknown as DocumentNode<HarvestFragmentFragment, unknown>;
export const MeFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"harvests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HarvestFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HarvestFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Harvest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"crop"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"weight_g"}},{"kind":"Field","name":{"kind":"Name","value":"area_m2"}},{"kind":"Field","name":{"kind":"Name","value":"yield_Kg_m2"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}}]}}]} as unknown as DocumentNode<MeFragmentFragment, unknown>;
export const HarvestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Harvests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderBy"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"harvests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HarvestFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HarvestFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Harvest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"crop"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"weight_g"}},{"kind":"Field","name":{"kind":"Name","value":"area_m2"}},{"kind":"Field","name":{"kind":"Name","value":"yield_Kg_m2"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}}]}}]} as unknown as DocumentNode<HarvestsQuery, HarvestsQueryVariables>;
export const AddHarvestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddHarvest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"harvest"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddHarvestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addHarvest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"harvest"},"value":{"kind":"Variable","name":{"kind":"Name","value":"harvest"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HarvestFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HarvestFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Harvest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"crop"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"weight_g"}},{"kind":"Field","name":{"kind":"Name","value":"area_m2"}},{"kind":"Field","name":{"kind":"Name","value":"yield_Kg_m2"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}}]}}]} as unknown as DocumentNode<AddHarvestMutation, AddHarvestMutationVariables>;
export const DeleteHarvestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteHarvests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteHarvests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HarvestFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HarvestFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Harvest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"crop"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"weight_g"}},{"kind":"Field","name":{"kind":"Name","value":"area_m2"}},{"kind":"Field","name":{"kind":"Name","value":"yield_Kg_m2"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}}]}}]} as unknown as DocumentNode<DeleteHarvestsMutation, DeleteHarvestsMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HarvestFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Harvest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"crop"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"weight_g"}},{"kind":"Field","name":{"kind":"Name","value":"area_m2"}},{"kind":"Field","name":{"kind":"Name","value":"yield_Kg_m2"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"harvests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HarvestFragment"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const AddUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HarvestFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Harvest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"crop"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"weight_g"}},{"kind":"Field","name":{"kind":"Name","value":"area_m2"}},{"kind":"Field","name":{"kind":"Name","value":"yield_Kg_m2"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"harvests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HarvestFragment"}}]}}]}}]} as unknown as DocumentNode<AddUserMutation, AddUserMutationVariables>;
export const UpdateHarvestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateHarvest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"harvest"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateHarvestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateHarvest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"harvest"},"value":{"kind":"Variable","name":{"kind":"Name","value":"harvest"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HarvestFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HarvestFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Harvest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"crop"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"weight_g"}},{"kind":"Field","name":{"kind":"Name","value":"area_m2"}},{"kind":"Field","name":{"kind":"Name","value":"yield_Kg_m2"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}}]}}]} as unknown as DocumentNode<UpdateHarvestMutation, UpdateHarvestMutationVariables>;