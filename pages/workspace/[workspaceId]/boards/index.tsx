import { Box, useColorModeValue } from "@chakra-ui/react";
import { RetroHeader } from "components/RetroHome";
import { RetroWorkspaceBoards } from "components/RetroWorkspace/RetroWorkspaceBoards";
import { RetroBoardProvider } from "context/RetroBoard/RetroBoardContext";
import Head from "next/head";
import React from "react";
import styled from "styled-components";
import withAuth from "utils/withAuth";

const AppWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const WorkspaceBoards = () => {
  const bg = useColorModeValue("#F7F7F7", "#0D131A");

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
