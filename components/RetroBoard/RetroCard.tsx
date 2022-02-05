import React, { useCallback, useContext, useState } from "react";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { IconButton, useDisclosure } from "@chakra-ui/react";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import { GiSelfLove } from "react-icons/gi";

import styled from "styled-components";
import { Item } from "utils/interfaces";
import EditItem from "./RetroItem/EditItem";
interface Props {
  item: Item;
  children?: React.ReactChild;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}

const StyledBox = styled(Box)`
  box-shadow: rgb(60 64 67 / 30%) 0px 1px 2px 0px,
    rgb(60 64 67 / 15%) 0px 1px 3px 1px;
  transition: background 100ms linear;
  border-radius: 5px;
  margin-bottom: 8px;
  margin-left: 4px;
  margin-right: 4px;
`;

const ContentDiv = styled.div`
  padding-bottom: 5px;
`;
const RetroCard = ({ item, provided, snapshot }: Props) => {
  const { isOpen, onClose, onOpen: openEditBox } = useDisclosure();

  if (isOpen) {
    return (
      <EditItem
        item_id={item.item_id}
        content={item.item_title}
        isOpen={isOpen}
        closeEditMode={onClose}
      />
    );
  }

  return (
    <StyledBox
      padding="10px 8px"
      background={snapshot.isDragging ? "#e8e9ed" : "white"}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <ContentDiv>
        <Text overflowWrap="anywhere" fontWeight="bolder">
          {item.item_title}
        </Text>
      </ContentDiv>
      <Stack direction="row-reverse">
        <RetroCardActions
          item_id={item.item_id}
          openEditBox={openEditBox}
          upvotes={item.item_upvotes}
        />
      </Stack>
    </StyledBox>
  );
};

const RetroCardActions = ({
  item_id,
  openEditBox,
  upvotes,
}: {
  item_id: string;
  openEditBox: () => void;
  upvotes: number;
}) => {
  const [isUpvote, setIsUpvote] = useState(false);
  const deleteItem = useCallback(() => {
    // const payload = { item_id };
    // dispatch(itemActions.deleteItem(payload));
    // dispatch({
    //   type: "DELETE_ITEM_REQUESTED",
    //   payload,
    // });
  }, []);

  const toggleUpvote = () => {
    setIsUpvote((prevState) => !prevState);
    const payload = { _id: item_id, isUpvote: !isUpvote };

    // dispatch({
    //   type: "UPDATE_ITEM_REQUESTED",
    //   payload,
    // });
  };

  return (
    <Box display="flex" gridGap="10px" padding="5px 0">
      <IconButton
        aria-label="Edit Card"
        icon={<FaPencilAlt />}
        isRound
        size="xs"
        onClick={openEditBox}
      />
      <IconButton
        aria-label="Delete card"
        icon={<FaTrash />}
        isRound
        size="xs"
        onClick={deleteItem}
      />

      <IconButton
        aria-label="Like"
        icon={<GiSelfLove />}
        isRound
        size="xs"
        onClick={toggleUpvote}
      />
    </Box>
  );
};
export default RetroCard;
