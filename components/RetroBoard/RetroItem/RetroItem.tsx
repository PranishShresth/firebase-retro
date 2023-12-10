import { Box, Stack } from "@chakra-ui/layout";
import { useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { useAuthContext } from "context/Auth/AuthContext";
import { useBoardFinal } from "context/RetroBoard/RetroBoardContext";
import React from "react";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import styled, { css } from "styled-components";
import { Comment, Item } from "utils/interfaces";
import { randomizeLetter } from "utils/shuffle";
import { RetroMarkDown } from "../ReactMarkdown/RetroMarkdown";
import EditItem from "./EditItem";
import { RetroComment } from "./RetroComment";
import { RetroItemComment } from "./RetroItemComment";
import { RetroItemCopy } from "./RetroItemCopy";
import { RetroItemDelete } from "./RetroItemDelete";
import { RetroItemEdit } from "./RetroItemEdit";
import { RetroItemLike } from "./RetroItemLike";
import { RetroItemMemberToolTip } from "./RetroItemMemberTooltip";

interface Props {
  listColour: string;
  item: Item;
  children?: React.ReactChild;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}

const RetroItem = ({ listColour, item, provided, snapshot }: Props) => {
  const { isOpen, onClose, onOpen: openEditBox } = useDisclosure();
  const { isOpen: isCommentsExpanded, onToggle: toggleComments } =
    useDisclosure();
  const bg = useColorModeValue("white", "#1C2A3A");
  const board = useBoardFinal();
  const { user } = useAuthContext();

  const isDragging = snapshot.isDragging;

  const hideItems = board.prefs.hideItems && item.userId !== user?.uid;
  const itemContent = hideItems
    ? randomizeLetter(item.itemTitle)
    : item.itemTitle;

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

  return (
    <StyledBox
      $listColour={listColour}
      background={bg}
      ref={provided.innerRef}
      $isDragging={isDragging}
      id={item.itemId}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <Box padding="16px 16px 24px 24px">
        <ContentDiv $hideItems={hideItems}>
          <RetroMarkDown text={itemContent} />
        </ContentDiv>

        <Stack direction="row-reverse">
          <RetroCardActions
            userId={item?.userId}
            itemId={item.itemId}
            text={item.itemTitle}
            openEditBox={openEditBox}
            isCommentsExpanded={isCommentsExpanded}
            toggleComments={toggleComments}
            itemComments={item.comments}
            itemUpvotes={item.itemUpvotes}
          />
        </Stack>
      </Box>
      {isCommentsExpanded && <RetroComment item={item} />}
    </StyledBox>
  );
};

const RetroCardActions = ({
  userId,
  itemId,
  openEditBox,
  itemComments,
  itemUpvotes,
  text,
  isCommentsExpanded,
  toggleComments,
}: {
  userId: string;
  itemId: string;
  openEditBox: () => void;
  itemComments: Comment[];
  itemUpvotes: string[];
  text: string;
  isCommentsExpanded: boolean;
  toggleComments: () => void;
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
          <RetroItemComment
            isCommentsExpanded={isCommentsExpanded}
            itemId={itemId}
            itemComments={itemComments}
            toggleComments={toggleComments}
          />
          <RetroItemMemberToolTip avatarSize="sm" userId={userId} />
        </Stack>
      </Box>
    </>
  );
};

const StyledBox = styled(Box)<{ $isDragging: boolean; $listColour: string }>`
  border-left: 8px solid ${({ $listColour }) => $listColour};
  box-shadow: rgb(60 64 67 / 30%) 0px 1px 2px 0px,
    rgb(60 64 67 / 15%) 0px 1px 3px 1px;
  margin-bottom: 32px;
  transition: background 100ms linear;
  ${({ $isDragging }) =>
    $isDragging &&
    css`
      box-shadow: rgba(207, 255, 24, 0.3) 0px 5px,
        rgba(207, 255, 24, 0.2) 0px 10px, rgba(207, 255, 24, 0.1) 0px 15px;
    `}

  position: relative;
`;

const ContentDiv = styled.div<{ $hideItems?: boolean }>`
  padding-bottom: 5px;
  ${({ $hideItems }) =>
    $hideItems &&
    css`
      filter: blur(4px);
    `}
`;

export default RetroItem;
