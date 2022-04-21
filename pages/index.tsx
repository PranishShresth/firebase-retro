import { Box, useColorModeValue } from "@chakra-ui/react";
import { RetroHeader, RetroBody } from "components/RetroHome";

import { NextPage } from "next";
import Head from "next/head";

import React from "react";


const RetroDashboard: NextPage = () => {
  const bg = useColorModeValue('#F7F7F7', 'gray.900')

  return (
    <Box background={bg} height="100%">
      <Head>
        <title>Retro Board</title>
      </Head>
      <RetroHeader />
      <RetroBody />
    </Box>
  );
};

export default RetroDashboard;
