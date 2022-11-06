import React from "react";
import { Box, Stack, Text, useColorModeValue } from "@chakra-ui/react";

import styled from "styled-components";
import { useRetroContext } from "context/RetroBoard/RetroBoardContext";
import AddList from "./RetroList/AddList";
import { RetroBoardFilter } from "./RetroBoardFilter";
import { RetroBoardShare } from "./RetroBoardShare";
import { IoArrowBackSharp } from "react-icons/io5";
import Link from "next/link";
import { format } from "date-fns";
const RetroBoardHeader = () => {
  const {
    board: { board, workspace },
  } = useRetroContext();
  console.log(workspace);
  const bg = useColorModeValue("white", "#1C2A3A");
  return (
    <Stack
      direction="row"
      alignItems="center"
      width={{ base: "100%", md: "95%" }}
      margin={{ base: "2px 0 0 0", md: "32px auto 0 auto" }}
      maxWidth="1600px"
      background={{ base: bg, md: "none" }}
      height={{ base: "60px" }}
      justifyContent="space-between"
    >
      <Link href={`/`} passHref>
        <Box
          padding="0 16px"
          borderRight="1px solid grey"
          display={{ md: "none" }}
          cursor="pointer"
        >
          <IoArrowBackSharp fontSize={32} />
        </Box>
      </Link>
      <Stack
        direction="column"
        height="100%"
        width="100%"
        justifyContent="center"
      >
        <Text
          fontWeight="bold"
          fontSize={{ base: "16px", md: "34px" }}
          textTransform="capitalize"
          lineHeight={1}
        >
          {board?.boardTitle}
        </Text>
        <Stack direction="row">
          <Link href={`/workspace/${workspace.workspaceId}/boards`} passHref>
            <Text
              fontSize={{ base: "14px" }}
              margin="0 !important"
              paddingRight="4px"
              textDecoration="underline"
              borderRight="1px solid grey"
              lineHeight={1}
              cursor="pointer"
            >
              {workspace.workspaceTitle}
            </Text>
          </Link>

          <Text
            fontSize={{ base: "14px" }}
            margin="0 0 0 4px !important"
            lineHeight={1}
          >
            {format(new Date(board.createdAt.seconds * 1000), "dd/MM/yyyy")}
          </Text>
        </Stack>
      </Stack>

      <Stack display={{ base: "none", md: "flex" }} direction="row">
        {/* <RetroTimer board={board} /> */}
        <RetroBoardFilter />
        <RetroBoardShare boardId={board.boardId} />
        <Box>
          <AddList />
        </Box>
      </Stack>
    </Stack>
  );
};

export default RetroBoardHeader;
