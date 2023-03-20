// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace ServerTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  TimeStamp: any;
};

export type User = {
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  nickname: Scalars['String'];
  role?: Maybe<UserRole>;
  sessionId?: Maybe<Scalars['String']>;
};

export type UserRole =
  | 'Admin'
  | 'Client';

export type LoginOutput = {
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  token?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type UserProfileOutput = {
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  user?: Maybe<User>;
};

export type ViduSession = {
  sessionId: Scalars['String'];
  createdAt: Scalars['TimeStamp'];
};

export type ViduSessionOutput = {
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  session?: Maybe<ViduSession>;
};

export type ViduTokenOutput = {
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  token?: Maybe<Scalars['String']>;
};

export type Query = {
  getUser: UserProfileOutput;
  getMe: UserProfileOutput;
  getSession: ViduSessionOutput;
  getToken: ViduTokenOutput;
  getTokenConnection: ViduTokenOutput;
};


export type QuerygetUserArgs = {
  id: Scalars['Float'];
};


export type QuerygetSessionArgs = {
  sessionId: Scalars['String'];
};


export type QuerygetTokenArgs = {
  sessionId: Scalars['String'];
};


export type QuerygetTokenConnectionArgs = {
  sessionId: Scalars['String'];
};

export type Mutation = {
  login: LoginOutput;
};


export type MutationloginArgs = {
  input: LoginInput;
};

export type LoginInput = {
  nickname: Scalars['String'];
};

  export type QuerySdk = {
      /** null **/
  getUser: InContextSdkMethod<Query['getUser'], QuerygetUserArgs, MeshContext>,
  /** null **/
  getMe: InContextSdkMethod<Query['getMe'], {}, MeshContext>,
  /** null **/
  getSession: InContextSdkMethod<Query['getSession'], QuerygetSessionArgs, MeshContext>,
  /** null **/
  getToken: InContextSdkMethod<Query['getToken'], QuerygetTokenArgs, MeshContext>,
  /** null **/
  getTokenConnection: InContextSdkMethod<Query['getTokenConnection'], QuerygetTokenConnectionArgs, MeshContext>
  };

  export type MutationSdk = {
      /** null **/
  login: InContextSdkMethod<Mutation['login'], MutationloginArgs, MeshContext>
  };

  export type SubscriptionSdk = {
    
  };

  export type Context = {
      ["Server"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
