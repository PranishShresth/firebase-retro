import {
  Box,
  Button,
  Input,
  InputGroup,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAuthContext } from "context/Auth/AuthContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "configs/firebase/firestore";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import styled from "styled-components";
import { auth } from "configs/firebase/firebaseClient";
import DualRingLoader from "components/Loader/DualRingLoader";
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
  firstName: string;
  password: string;
  surname: string;
}

const Register: NextPage = () => {
  const { updateUser } = useAuthContext();
  const bg = useColorModeValue("#F7F7F7", "gray.900");
  const boxShadowColour = useColorModeValue("#e2e6ea", "#171923");
  const formBg = useColorModeValue("#ffffff", "#4A5568");
  const {
    handleSubmit,
    control,
    resetField,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      firstName: "",
      password: "",
      surname: "",
    },
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSignInPage, setShowSignInPage] = useState(false);

  const handleSignUpUser = async (data: FormValues) => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      updateUser(userCredential.user);

      const ref = doc(firestore, "users", userCredential.user.uid);

      await setDoc(ref, {
        first_name: data.firstName,
        email: data.email,
        surname: data.surname,
        user_id: userCredential.user.uid,
        created_at: serverTimestamp(),
      });

      setShowSignInPage(true);

      setIsLoading(false);
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

  if (showSignInPage) {
    Router.push("/signIn");
  }

  return (
    <Box background={bg} height="100%">
      <Head>
        <title>Sign Up</title>
      </Head>
      <StyledForm
        background={formBg}
        boxShadowColour={boxShadowColour}
        onSubmit={handleSubmit(handleSignUpUser)}
      >
        <Text
          color={"#2bc0c1"}
          fontFamily="Commissioner"
          fontSize="3xl"
          textAlign="center"
        >
          Sign Up
        </Text>
        <Stack spacing={3}>
          <div>
            <span>First Name:</span>
            <InputGroup marginTop="4px">
              <Controller
                control={control}
                name="firstName"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="First Name"
                    required
                    type="text"
                    value={field.value}
                  />
                )}
              />
            </InputGroup>
          </div>
          <div>
            <span>Surname:</span>
            <InputGroup marginTop="4px">
              <Controller
                control={control}
                name="surname"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Surname"
                    required
                    type="text"
                    value={field.value}
                  />
                )}
              />
            </InputGroup>
          </div>
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
            Already have an account?{" "}
            <PageLink href="/signIn">
              <a style={{ color: "#2bc0c1" }}>Sign in!</a>
            </PageLink>
          </span>
          <div>
            <Button
              backgroundColor={"#2bc0c1"}
              color={"#ffffff"}
              marginBottom="12px"
              type="submit"
              width={"100%"}
            >
              Sign Up
            </Button>
          </div>
        </Stack>
      </StyledForm>
    </Box>
  );
};

export default Register;
