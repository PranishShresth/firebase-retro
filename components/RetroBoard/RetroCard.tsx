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
  listColour: string;
  item: Item;
  children?: React.ReactChild;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}

const StyledBox = styled(Box)`
  border-left: 5px solid
    ${({ $listColour }: { $listColour: string }) => $listColour};
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
const RetroCard = ({ listColour, item, provided, snapshot }: Props) => {
  const { isOpen, onClose, onOpen: openEditBox } = useDisclosure();
  const bg = useColorModeValue("white", "gray.600");

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
      padding="10px 8px"
      background={bg}
      ref={provided.innerRef}
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
          createdBy={item?.createdBy}
          item_id={item.itemId}
          openEditBox={openEditBox}
          itemUpvotes={item.itemUpvotes}
        />
      </Stack>
    </StyledBox>
  );
};

const RetroCardActions = ({
  createdBy,
  item_id,
  openEditBox,
  itemUpvotes,
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
  const allowEditAndDelete = user?.uid === createdBy?.userId;
  const lightOrDarkStarBg = useColorModeValue("#F91880", "#FBBD08");
  const isUpvoted = user && itemUpvotes.includes(user.uid);

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
      if (!itemUpvotes.includes(user?.uid)) {
        await updateDoc(itemRef, {
          itemUpvotes: arrayUnion(user?.uid),
        });
      } else {
        await updateDoc(itemRef, {
          itemUpvotes: arrayRemove(user?.uid),
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
              label={`${createdBy.firstName} ${createdBy.lastName}`}
            >
              <Avatar
                size="xs"
                name={`${createdBy.firstName} ${createdBy.lastName}`}
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
            <span style={{ lineHeight: "16px" }}>{itemUpvotes.length}</span>
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
