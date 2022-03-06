import React from "react";
import { RetroBoardProvider } from "context/RetroBoard/RetroBoardContext";
import { RetroBoardSingle } from "components/RetroBoard";
import { RetroHeader } from "components/RetroHome";
import styled from "styled-components";
import Head from "next/head";
const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 1600px;
  margin: 0 auto;
`;
const RetroBoard = () => {
  return (
    <AppWrapper>
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

export default RetroBoard;
