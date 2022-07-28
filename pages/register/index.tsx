import {
  Box,
  Button,
  Input,
  InputGroup,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useAuthContext } from "context/Auth/AuthContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  DocumentData,
  DocumentReference,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
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
import { Collection } from "utils/firebaseCollection";
import { uuidV4 } from "utils/uuidV4";
import { Workspace } from "utils/interfaces";

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
  lastName: string;
}

const Register: NextPage = () => {
  const { updateUser } = useAuthContext();
  const toast = useToast();
  const bg = useColorModeValue("#F7F7F7", "gray.900");
  const boxShadowColour = useColorModeValue("#e2e6ea", "#171923");
  const formBg = useColorModeValue("#ffffff", "#4A5568");
  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      email: "",
      firstName: "",
      password: "",
      lastName: "",
    },
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSignInPage, setShowSignInPage] = useState(false);

  const handleUserCreation = async (data: FormValues): Promise<void> => {
    try {
      const workspaceId = uuidV4();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      updateUser(userCredential.user);
      const userRef = doc(firestore, Collection.Users, userCredential.user.uid);
      const workspaceRef = doc(firestore, Collection.Workspaces, workspaceId);

      const member = {
        firstName: data.firstName,
        email: data.email,
        lastName: data.lastName,
        userId: userCredential.user.uid,
        workspaces: [workspaceId],
      };

      await setDoc(userRef, {
        ...member,
        createdAt: serverTimestamp(),
      });

      setDoc(workspaceRef, {
        workspaceDescription: "",
        workspaceId,
        workspaceTitle: "My Workspace",
        userId: userCredential.user.uid,
        members: [member],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignUpUser = async (data: FormValues) => {
    try {
      setIsLoading(true);
      await handleUserCreation(data);
      toast({
        title: "User successfully created",
        description: "You can now log in with your credentials",
        status: "success",
        duration: 4000,
        isClosable: true,
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
            <span>Last Name:</span>
            <InputGroup marginTop="4px">
              <Controller
                control={control}
                name="lastName"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="lastName"
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
              _hover={{ bg: "#2C7A7B" }}
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
