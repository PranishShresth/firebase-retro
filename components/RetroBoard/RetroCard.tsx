import React from "react";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { IconButton, useDisclosure } from "@chakra-ui/react";
import { FiHeart, FiEdit3, FiTrash2 } from "react-icons/fi";
import styled from "styled-components";
import { Item } from "utils/interfaces";
import EditItem from "./RetroItem/EditItem";
import { firestore } from "configs/firebase/firestore";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
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

const StyledIconAction = styled.div<{ hoverColor?: string; color?: string }>`
  transition: color 100ms linear;
  cursor: pointer;
  color: ${(props) => props.color};
  &:hover {
    color: ${(props) => props.hoverColor};
  }
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
        <Text overflowWrap="anywhere" fontWeight="normal" fontSize="15px">
          {item.item_title}
        </Text>
      </ContentDiv>
      <Stack direction="row-reverse">
        <RetroCardActions
          item_id={item.item_id}
          openEditBox={openEditBox}
          item_upvotes={item.item_upvotes}
        />
      </Stack>
    </StyledBox>
  );
};

const RetroCardActions = ({
  item_id,
  openEditBox,
  item_upvotes,
}: // upvotes,
{
  item_id: string;
  openEditBox: () => void;
  item_upvotes: string[];
}) => {
  const { user } = useAuthContext();
  const deleteItem = async () => {
    try {
      const itemRef = doc(firestore, "items", item_id);
      await deleteDoc(itemRef);
    } catch {
      console.log("err");
    }
  };

  const toggleUpvote = async () => {
    if (user) {
      const itemRef = doc(firestore, "items", item_id);
      if (!item_upvotes.includes(user?.uid)) {
        await updateDoc(itemRef, {
          item_upvotes: arrayUnion(user?.uid),
        });
      } else {
        await updateDoc(itemRef, {
          item_upvotes: arrayRemove(user?.uid),
        });
      }
    }
  };

  const isUpvoted = () => {
    if (user) {
      const isUpvoted = item_upvotes.includes(user.uid);
      return isUpvoted ? "rgb(249, 24, 128);" : "black";
    }
    return "black";
  };

  return (
    <Box
      display="flex"
      gridGap="15px"
      padding="5px 0"
      justifyContent="center"
      alignItems="center"
    >
      <StyledIconAction onClick={openEditBox}>
        <FiEdit3 />
      </StyledIconAction>
      <StyledIconAction onClick={deleteItem}>
        <FiTrash2 />
      </StyledIconAction>
      <StyledIconAction
        onClick={toggleUpvote}
        hoverColor="rgb(249, 24, 128)"
        color={isUpvoted()}
      >
        <Stack direction="row" spacing={2}>
          <FiHeart />
          <span style={{ lineHeight: "16px" }}>{item_upvotes.length}</span>
        </Stack>
      </StyledIconAction>
    </Box>
  );
};
export default RetroCard;
