import {
  Box,
  Button,
  Input,
  InputGroup,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import DualRingLoader from "components/Loader/DualRingLoader";
import { auth } from "configs/firebase/firebaseClient";
import { useAuthContext } from "context/Auth/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { firebaseErrors } from "utils/firebaseErrors";

const FormErrorMessage = styled.span`
  color: #e8575b;
  font-weight: bold;
`;

const PageLink = styled(Link)`
  text-decoration: none;
`;

const StyledForm = styled.form<{ background: string; boxShadowColour: string }>`
  background-color: ${({ background }) => background};
  border-radius: 0.5rem;
  box-shadow: ${({ boxShadowColour }) => `0 1px 3px 3px ${boxShadowColour}`};
  box-sizing: border-box;
  left: 50%;
  padding: 2rem;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
`;

interface FormValues {
  email: string;
  password: string;
}

const SignIn: NextPage = () => {
  const { updateUser } = useAuthContext();
  const bg = useColorModeValue("#F7F7F7", "gray.900");
  const boxShadowColour = useColorModeValue("#e2e6ea", "#171923");
  const formBg = useColorModeValue("#ffffff", "#4A5568");
  const {
    handleSubmit,
    control,

    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignInUser = async (data: FormValues) => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      if (userCredential.user.hasOwnProperty("accessToken")) {
        updateUser(userCredential.user);
        Router.push("/");
      }
    } catch (error: any) {
      setIsLoading(false);
      setError(error.code);
    }
  };

  if (isLoading) {
    return (
      <Box backgroundColor={bg} height={"100%"} width={"100%"}>
        <DualRingLoader />
      </Box>
    );
  }

  return (
    <Box background={bg} height="100%">
      <Head>
        <title>Sign In</title>
      </Head>
      <StyledForm
        background={formBg}
        boxShadowColour={boxShadowColour}
        onSubmit={handleSubmit(handleSignInUser)}
      >
        <Text
          color={"#2bc0c1"}
          fontFamily="Commissioner"
          fontSize="3xl"
          textAlign="center"
        >
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
          {error && (
            <FormErrorMessage>{firebaseErrors[error]}</FormErrorMessage>
          )}
          <span>
            Don&#39;t have an account?{" "}
            <PageLink href="/register">
              <a style={{ color: "#2bc0c1" }}>Sign up here!</a>
            </PageLink>
          </span>
          <div>
            <Button
              backgroundColor={"#2bc0c1"}
              color={"#ffffff"}
              marginBottom="12px"
              type="submit"
              width={"100%"}
              _hover={{ bg: "#2C7A7B" }}
            >
              Login
            </Button>
          </div>
        </Stack>
      </StyledForm>
    </Box>
  );
};

export default SignIn;
