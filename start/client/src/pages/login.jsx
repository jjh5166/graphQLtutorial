import React from "react";
import { useApolloClient, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { LoginForm, Loading } from "../components";
import ApolloClient from "apollo-client";

export const LOGIN_USER = gql`
  mutation login($email: String!) {

    login(email: $email)
  }
`;

// The first value in the useMutation result tuple is a mutate function that actually triggers the mutation when
// it is called.The second value in the result tuple is a result object that contains loading and error state,
// as well as the return value from the mutation. 

// Our useMutation hook returns a mutate function (login) and the data object returned from the mutation
// that we destructure from the tuple.Finally, we pass our login function to the LoginForm component.
export default function Login() {
  const client = useApolloClient();
  const [login, { loading, error }] = useMutation(LOGIN_USER, {
    onCompleted({ login }) {
      // pass an onCompleted callback to useMutation that will be called once the mutation is complete
      // with its return value.This callback is where we will save the login token to localStorage
      localStorage.setItem("token", login);
      client.writeData({ data: { isLoggedIn: true } });
      // writes local data to the Apollo cache indicating that the user is logged in.
    }
  });
  if (loading) return <Loading />;
  if (error) return <p>An error occurred</p>;

  return <LoginForm login={login} />;
}