import React from "react";
import { RetroBoardProvider } from "context/RetroBoard/RetroBoardContext";
import { RetroHeader } from "components/RetroHome";
import styled from "styled-components";
import Head from "next/head";
import { Box, useColorModeValue } from "@chakra-ui/react";
import withAuth from "utils/withAuth";
import { RetroWorkspaceBoards } from "components/RetroWorkspace/RetroWorkspaceBoards";

const AppWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const WorkspaceBoards = () => {
  const bg = useColorModeValue("#F7F7F7", "gray.900");

  return (
    <AppWrapper background={bg}>
      <RetroBoardProvider>
        <Head>
          <title>Shiny Retro</title>
        </Head>
        <RetroHeader />
        <RetroWorkspaceBoards />
      </RetroBoardProvider>
    </AppWrapper>
  );
};

export default withAuth(WorkspaceBoards);
