import {
  Box,
  Button,
  Input,
  InputGroup,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Head from "next/head";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";

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

  @media (max-width: 480px) {
    width: 100%;
  }
`;

interface FormValues {
  email: string;
  password: string;
}

const ResetPassword = () => {
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
  // const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleResetUser = async (data: FormValues) => {
    // setIsLoading(true);

    const auth = getAuth();
    sendPasswordResetEmail(auth, data.email)
      .then(() => {
        // Password reset email sent!
        toast({
          title: "Email sent!",
          description: "Please check your spam or junk inbox too!",
          status: "success",
          duration: 7000,
          isClosable: true,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        toast({
          title: "Uh oh!",
          description: `${errorCode} ${errorMessage}`,
          status: "error",
          duration: 7000,
          isClosable: true,
        });
      });
  };

  return (
    <Box background={bg} height="100%">
      <Head>
        <title>Reset Password</title>
      </Head>
      <StyledForm
        background={formBg}
        boxShadowColour={boxShadowColour}
        onSubmit={handleSubmit(handleResetUser)}
      >
        <Text
          color={"#2bc0c1"}
          fontFamily="Commissioner"
          fontSize="3xl"
          textAlign="center"
        >
          Reset Password
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
            <Button
              backgroundColor={"#2bc0c1"}
              color={"#ffffff"}
              marginBottom="12px"
              marginTop="12px"
              type="submit"
              width={"100%"}
              _hover={{ bg: "#2C7A7B" }}
            >
              Send Reset Email
            </Button>
          </div>
          <span>
            <PageLink href="/signIn">
              <a style={{ color: "#2bc0c1" }}>Go back to Signing in!</a>
            </PageLink>
          </span>
        </Stack>
      </StyledForm>
    </Box>
  );
};

export default ResetPassword;
