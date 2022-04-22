import React from "react";
import { Box, Icon, Stack, Text } from "@chakra-ui/react";
import { GiNinjaHead } from "react-icons/gi";

// import CreateList from "./List/CreateList";
// import { useSelector } from "react-redux";
import styled from "styled-components";
import { useRetroContext } from "context/RetroBoard/RetroBoardContext";
import AddList from "./RetroList/AddList";

const IconDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2bc0c1;
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
  console.log(board);
  return (
    <Stack
      direction="row"
      justifyContent={"space-between"}
      paddingTop="25px"
      width="95%"
      margin="0 auto"
      maxWidth="1600px"
    >
      <Stack direction="row">
        <IconDiv>
          <Icon as={GiNinjaHead} w={6} h={6} />
        </IconDiv>
        <Text fontWeight={"500"} fontSize={"1.9rem"}>
          {board?.board_title}
        </Text>
      </Stack>

      {showListCreation && (
        <Box>
          <AddList />
        </Box>
      )}
    </Stack>
  );
};

export default RetroBoardHeader;
