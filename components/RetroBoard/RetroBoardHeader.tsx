import React from "react";
import { Box, Button, Icon, Stack, Text } from "@chakra-ui/react";
import { GiNinjaHead } from "react-icons/gi";
import { FiSettings } from "react-icons/fi";
import { BiShareAlt } from "react-icons/bi";
import styled from "styled-components";
import { useRetroContext } from "context/RetroBoard/RetroBoardContext";
import AddList from "./RetroList/AddList";
import { RetroBoardFilter } from "./RetroBoardFilter";
import { RetroBoardShare } from "./RetroBoardShare";
import { RetroTimer } from "./RetroTimer";

const IconDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2bc0c1;
  height: 100%;
  width: 36px;
  color: #ffffff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
    rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
`;

const RetroBoardHeader = () => {
  const {
    board: { board, lists },
  } = useRetroContext();
  const currentListCount = lists && lists?.length;
  const boardLimit = board?.board_limit;
  const showListCreation = boardLimit && boardLimit > currentListCount;

  return (
    <Stack
      direction="row"
      justifyContent={"space-between"}
      paddingTop="25px"
      width="95%"
      margin="0 auto"
      maxWidth="1600px"
    >
      <Stack direction="row" align="center" height="100%">
        <IconDiv>
          <Icon as={GiNinjaHead} w={6} h="100%" />
        </IconDiv>
        <Text fontWeight="bold" fontSize={"1.2rem"}>
          {board?.board_title}
        </Text>
      </Stack>

      <Stack direction="row">
        <RetroTimer board={board} />
        <RetroBoardFilter />
        <RetroBoardShare boardId={board.board_id} />
        {/* <Button>
          <FiSettings />
        </Button> */}
        {showListCreation && (
          <Box>
            <AddList />
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export default RetroBoardHeader;
