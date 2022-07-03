import { Box, useColorModeValue } from "@chakra-ui/react";
import { RetroHeader, RetroBody } from "components/RetroHome";
import { RetroWorkspace } from "components/RetroWorkspace";
import { NextPage } from "next";
import Head from "next/head";

import React from "react";
import withAuth from "utils/withAuth";

const RetroDashboard: NextPage = () => {
  const bg = useColorModeValue("#F7F7F7", "gray.900");

  return (
    <Box background={bg} height="100%">
      <Head>
        <title>Retro Board</title>
      </Head>
      <RetroHeader />
      <RetroWorkspace />
    </Box>
  );
};

export default withAuth(RetroDashboard);
