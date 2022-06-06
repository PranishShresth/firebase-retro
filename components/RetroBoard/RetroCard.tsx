import React from "react";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import { Box, Stack, Text } from "@chakra-ui/layout";
import {
  Avatar,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FiStar, FiEdit3, FiTrash2 } from "react-icons/fi";
import styled from "styled-components";
import { Item, UserDetails } from "utils/interfaces";
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
import { AlertDialogBar } from "components/Alert";
interface Props {
  list_colour: string;
  item: Item;
  children?: React.ReactChild;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}

const StyledBox = styled(Box)`
  border-left: 5px solid
    ${({ list_colour }: { list_colour: string }) => list_colour};
  box-shadow: rgb(60 64 67 / 30%) 0px 1px 2px 0px,
    rgb(60 64 67 / 15%) 0px 1px 3px 1px;
  margin: 4px 4px 8px 4px;
  transition: background 100ms linear;
`;

const ContentDiv = styled.div`
  padding-bottom: 5px;
`;

const StyledIconAction = styled.div<{ hoverColor?: string; color?: string }>`
  color: ${(props) => props.color};
  cursor: pointer;
  transition: color 100ms linear;
  &:hover {
    color: ${(props) => props.hoverColor};
  }
`;
const RetroCard = ({ list_colour, item, provided, snapshot }: Props) => {
  const { isOpen, onClose, onOpen: openEditBox } = useDisclosure();
  const bg = useColorModeValue("white", "gray.600");

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
      list_colour={list_colour}
      padding="10px 8px"
      background={bg}
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
          createdBy={item?.createdBy}
          item_id={item.item_id}
          openEditBox={openEditBox}
          item_upvotes={item.item_upvotes}
        />
      </Stack>
    </StyledBox>
  );
};

const RetroCardActions = ({
  createdBy,
  item_id,
  openEditBox,
  item_upvotes,
}: // upvotes,
{
  createdBy: UserDetails | undefined;
  item_id: string;
  openEditBox: () => void;
  item_upvotes: string[];
}) => {
  const bg = useColorModeValue("black", "gray.600");
  const { user } = useAuthContext();
  const {
    isOpen: isDeleteDialogOpen,
    onClose: closeDeleteDialog,
    onOpen: openDeleteDialog,
  } = useDisclosure();
  const allowEditAndDelete = user?.uid === createdBy?.user_id;
  const lightOrDarkStarBg = useColorModeValue("#F91880", "#FBBD08");
  const isUpvoted = user && item_upvotes.includes(user.uid);

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

  return (
    <>
      <Box
        display="flex"
        gridGap="15px"
        padding="5px 0 0 0"
        justifyContent="center"
        alignItems="center"
      >
        {createdBy && (
          <div>
            <Tooltip
              bg="gray.300"
              color="black"
              hasArrow
              label={`${createdBy.first_name} ${createdBy.surname}`}
            >
              <Avatar
                size="xs"
                name={`${createdBy.first_name} ${createdBy.surname}`}
              />
            </Tooltip>
          </div>
        )}
        {allowEditAndDelete && (
          <>
            <StyledIconAction onClick={openEditBox}>
              <FiEdit3 />
            </StyledIconAction>
            <StyledIconAction onClick={openDeleteDialog}>
              <FiTrash2 />
            </StyledIconAction>
          </>
        )}

        <StyledIconAction
          color={isUpvoted ? lightOrDarkStarBg : bg}
          hoverColor={lightOrDarkStarBg}
          onClick={toggleUpvote}
        >
          <Stack direction="row" spacing={2}>
            <FiStar fill={isUpvoted ? lightOrDarkStarBg : "#FFFFFF"} />
            <span style={{ lineHeight: "16px" }}>{item_upvotes.length}</span>
          </Stack>
        </StyledIconAction>
      </Box>
      <AlertDialogBar
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onClick={deleteItem}
        title="Delete Card"
        ariaLabel="Delete Card Dialogue"
      />
    </>
  );
};
export default RetroCard;
