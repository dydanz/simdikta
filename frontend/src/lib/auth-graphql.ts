import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
      message
      sessionToken
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
      message
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      verified
      createdDate
    }
  }
`;

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginPayload {
  success: boolean;
  message: string;
  sessionToken?: string;
}

export interface LogoutPayload {
  success: boolean;
  message: string;
}

export interface User {
  id: string;
  email: string;
  verified: boolean;
  createdDate: string;
}