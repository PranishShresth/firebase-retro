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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "configs/firebase/firestore";
import { NextPage } from "next";
import Head from "next/head";
import Router from "next/router";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import styled from "styled-components";

const StyledForm = styled.form`
  margin: 0 auto;
  max-width: 600px;
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
  const {
    handleSubmit,
    control,
    resetField,
    formState: { errors },
  } = useForm<FormValues>();
  const [isLoading, setIsLoading] = useState(false);
  const [showSignInPage, setShowSignInPage] = useState(false);

  const auth = getAuth();

  const handleSignUpUser = async (data: FormValues) => {
    console.log(data);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // console.log(user);

      console.log(userCredential);
      updateUser(userCredential.user);

      const ref = doc(firestore, "users", userCredential.user.uid);

      console.log("uid", userCredential.user.uid);

      await setDoc(ref, {
        first_name: data.firstName,
        email: data.email,
        surname: data.surname,
        user_id: userCredential.user.uid,
        created_at: serverTimestamp(),
      });

      setShowSignInPage(true);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  if (showSignInPage) {
    Router.push("/signIn");
  }

  return (
    <Box background={bg} height="100%">
      <Head>
        <title>Sign Up</title>
      </Head>
      <StyledForm onSubmit={handleSubmit(handleSignUpUser)}>
        <Text fontSize="3xl" textAlign="center">
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

export default Register;
