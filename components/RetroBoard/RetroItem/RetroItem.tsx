import React from "react";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import { Box, Stack, Text } from "@chakra-ui/layout";
import {
  Avatar,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import styled, { css } from "styled-components";
import { Item } from "utils/interfaces";
import EditItem from "./EditItem";

import { useAuthContext } from "context/Auth/AuthContext";
import { useRetroContext } from "context/RetroBoard/RetroBoardContext";
import { RetroItemEdit } from "./RetroItemEdit";
import { RetroItemDelete } from "./RetroItemDelete";
import { RetroItemLike } from "./RetroItemLike";
import { RetroItemCopy } from "./RetroItemCopy";
interface Props {
  listColour: string;
  item: Item;
  children?: React.ReactChild;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}

const StyledBox = styled(Box)<{ $isDragging: boolean; $listColour: string }>`
  border-left: 8px solid ${({ $listColour }) => $listColour};
  box-shadow: rgb(60 64 67 / 30%) 0px 1px 2px 0px,
    rgb(60 64 67 / 15%) 0px 1px 3px 1px;
  margin-bottom: 32px;
  transition: background 100ms linear;
  ${({ $isDragging }) =>
    $isDragging &&
    css`
      transform: rotate(-3.2deg);
    `}
  position: relative;
`;

const ContentDiv = styled.div`
  padding-bottom: 5px;
`;

const RetroItem = ({ listColour, item, provided, snapshot }: Props) => {
  const { isOpen, onClose, onOpen: openEditBox } = useDisclosure();
  const bg = useColorModeValue("white", "#1C2A3A");
  const isDragging = snapshot.isDragging;

  if (isOpen) {
    return (
      <EditItem
        itemId={item.itemId}
        content={item.itemTitle}
        isOpen={isOpen}
        closeEditMode={onClose}
      />
    );
  }

  console.log("isDragging", isDragging);

  return (
    <StyledBox
      $listColour={listColour}
      padding="16px 16px 24px 16px"
      background={bg}
      ref={provided.innerRef}
      $isDragging={isDragging}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <ContentDiv>
        <Text overflowWrap="anywhere" fontWeight="normal" fontSize="15px">
          {item.itemTitle}
        </Text>
      </ContentDiv>
      <Stack direction="row-reverse">
        <RetroCardActions
          userId={item?.userId}
          itemId={item.itemId}
          text={item.itemTitle}
          openEditBox={openEditBox}
          itemUpvotes={item.itemUpvotes}
        />
      </Stack>
    </StyledBox>
  );
};

const RetroCardActions = ({
  userId,
  itemId,
  openEditBox,
  itemUpvotes,
  text,
}: {
  userId: string;
  itemId: string;
  openEditBox: () => void;
  itemUpvotes: string[];
  text: string;
}) => {
  const { user } = useAuthContext();

  const allowEditAndDelete = user?.uid === userId;

  return (
    <>
      <Box
        display="flex"
        gridGap="15px"
        position="absolute"
        transform="translateY(30%)"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Stack direction="row" transform="translateX(28px)">
          {allowEditAndDelete && (
            <>
              <RetroItemDelete itemId={itemId} />
              <RetroItemEdit openEditBox={openEditBox} />
            </>
          )}
          <RetroItemCopy text={text} />
        </Stack>
        <Stack direction="row">
          <RetroItemLike itemId={itemId} itemUpvotes={itemUpvotes} />
          <RetroItemMemberToolTip userId={userId} />
        </Stack>
      </Box>
    </>
  );
};

const RetroItemMemberToolTip = ({ userId }: { userId: string }) => {
  const {
    board: {
      board: { members },
    },
  } = useRetroContext();

  const member = members.find((_) => _.userId === userId);
  if (!member) return null;

  const label = `${member.firstName} ${member.lastName}`;
  return (
    <div>
      <Tooltip bg="gray.300" color="black" hasArrow label={label}>
        <Avatar size="sm" name={label} />
      </Tooltip>
    </div>
  );
};

export default RetroItem;
