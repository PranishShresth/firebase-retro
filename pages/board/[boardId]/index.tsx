import React from "react";
import { RetroBoardProvider } from "context/RetroBoard/RetroBoardContext";
import { RetroBoardSingle } from "components/RetroBoard";
import { RetroHeader } from "components/RetroHome";
import styled from "styled-components";
import Head from "next/head";
import { Box, useColorModeValue } from "@chakra-ui/react";
import withAuth from "utils/withAuth";

const AppWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const RetroBoard = () => {
  const bg = useColorModeValue("white", "gray.900");

  return (
    <AppWrapper background={bg}>
      <RetroBoardProvider>
        <Head>
          <title>Retro Board</title>
        </Head>
        <RetroHeader />
        <RetroBoardSingle />
      </RetroBoardProvider>
    </AppWrapper>
  );
};

export default withAuth(RetroBoard);
