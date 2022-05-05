import {
  Box,
  Button,
  Input,
  InputGroup,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";

const PageLink = styled(Link)`
  text-decoration: none;
`;

const StyledForm = styled.form`
  margin: 0 auto;
  max-width: 600px;
`;

interface FormValues {
  email: string;
  password: string;
}

const SignIn: NextPage = () => {
  const bg = useColorModeValue("#F7F7F7", "gray.900");
  const {
    handleSubmit,
    control,
    resetField,
    formState: { errors },
  } = useForm<FormValues>();
  const [isLoading, setIsLoading] = useState(false);
  const [showBoardsPage, setShowBoardsPage] = useState(false);

  const auth = getAuth();

  const handleSignInUser = async (data: FormValues) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      // console.log(user);

      console.log(userCredential);
      if (userCredential.user.hasOwnProperty("accessToken")) {
        // updateUser(userCredential.user);

        setShowBoardsPage(true);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  if (showBoardsPage) {
    Router.push("/");
  }

  return (
    <Box background={bg} height="100%">
      <Head>
        <title>Sign In</title>
      </Head>
      <StyledForm onSubmit={handleSubmit(handleSignInUser)}>
        <Text fontSize="3xl" textAlign="center">
          Sign In
        </Text>
        <Stack spacing={3}>
          <div>
            <span>Email:</span>
            <InputGroup marginTop="4px">
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Email"
                    required
                    type="text"
                    value={field.value}
                  />
                )}
              />
            </InputGroup>
          </div>
          <div>
            <span>Password:</span>
            <InputGroup marginTop="4px">
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Password"
                    required
                    type="password"
                    value={field.value}
                  />
                )}
              />
            </InputGroup>
          </div>
          <PageLink href="/register">Don&#39;t have an account?</PageLink>
          <div>
            <Button marginBottom="12px" type="submit">
              Login
            </Button>
          </div>
        </Stack>
      </StyledForm>
    </Box>
  );
};

export default SignIn;
