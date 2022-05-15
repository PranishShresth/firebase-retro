import React from "react";
import { RetroBoardProvider } from "context/RetroBoard/RetroBoardContext";
import { RetroHeader } from "components/RetroHome";
import UserProfile from "components/UserProfile";
import styled from "styled-components";
import Head from "next/head";
import { Box, useColorModeValue } from "@chakra-ui/react";
import withAuth from "utils/withAuth";

const AppWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Profile = () => {
  const bg = useColorModeValue("#F7F7F7", "gray.900");

  return (
    <AppWrapper background={bg}>
      <RetroBoardProvider>
        <Head>
          <title>Profile</title>
        </Head>
        <RetroHeader />
        <UserProfile />
      </RetroBoardProvider>
    </AppWrapper>
  );
};

export default withAuth(Profile);
