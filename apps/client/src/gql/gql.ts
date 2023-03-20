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
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n  query getToken($sessionId: String!) {\n    getToken(sessionId: $sessionId) {\n      ok\n      token\n    }\n  }\n": types.GetTokenDocument,
    "\n  query getSession($sessionId: String!) {\n    getSession(sessionId: $sessionId) {\n      ok\n      session {\n        sessionId\n        createdAt\n      }\n      error\n    }\n  }\n": types.GetSessionDocument,
    "\n  query getTokenConnection($sessionId: String!) {\n    getTokenConnection(sessionId: $sessionId) {\n      ok\n      token\n      error\n    }\n  }\n": types.GetTokenConnectionDocument,
    "\n  query getMe {\n    getMe {\n      ok\n      user {\n        id\n        nickname\n        createdAt\n        updatedAt\n        role\n        sessionId\n      }\n      error\n    }\n  }\n": types.GetMeDocument,
    "\n  mutation login($LoginInput: LoginInput!) {\n    login(input: $LoginInput) {\n      ok\n      token\n      error\n      user {\n        id\n        nickname\n        updatedAt\n        createdAt\n        role\n      }\n    }\n  }\n": types.LoginDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getToken($sessionId: String!) {\n    getToken(sessionId: $sessionId) {\n      ok\n      token\n    }\n  }\n"): (typeof documents)["\n  query getToken($sessionId: String!) {\n    getToken(sessionId: $sessionId) {\n      ok\n      token\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getSession($sessionId: String!) {\n    getSession(sessionId: $sessionId) {\n      ok\n      session {\n        sessionId\n        createdAt\n      }\n      error\n    }\n  }\n"): (typeof documents)["\n  query getSession($sessionId: String!) {\n    getSession(sessionId: $sessionId) {\n      ok\n      session {\n        sessionId\n        createdAt\n      }\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getTokenConnection($sessionId: String!) {\n    getTokenConnection(sessionId: $sessionId) {\n      ok\n      token\n      error\n    }\n  }\n"): (typeof documents)["\n  query getTokenConnection($sessionId: String!) {\n    getTokenConnection(sessionId: $sessionId) {\n      ok\n      token\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMe {\n    getMe {\n      ok\n      user {\n        id\n        nickname\n        createdAt\n        updatedAt\n        role\n        sessionId\n      }\n      error\n    }\n  }\n"): (typeof documents)["\n  query getMe {\n    getMe {\n      ok\n      user {\n        id\n        nickname\n        createdAt\n        updatedAt\n        role\n        sessionId\n      }\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation login($LoginInput: LoginInput!) {\n    login(input: $LoginInput) {\n      ok\n      token\n      error\n      user {\n        id\n        nickname\n        updatedAt\n        createdAt\n        role\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation login($LoginInput: LoginInput!) {\n    login(input: $LoginInput) {\n      ok\n      token\n      error\n      user {\n        id\n        nickname\n        updatedAt\n        createdAt\n        role\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;