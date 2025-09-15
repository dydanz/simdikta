import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      success
      message
      user {
        id
        email
        verified
        createdDate
      }
    }
  }
`;

export const VERIFY_USER = gql`
  mutation VerifyUser($token: String!) {
    verifyUser(token: $token) {
      success
      message
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
      message
      token
      user {
        id
        email
        verified
        createdDate
      }
    }
  }
`;

export interface CreateUserInput {
  email: string;
  password: string;
  retypePassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  verified: boolean;
  createdDate: string;
}

export interface CreateUserPayload {
  success: boolean;
  message: string;
  user?: User;
}

export interface VerifyUserPayload {
  success: boolean;
  message: string;
}

export interface LoginPayload {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}