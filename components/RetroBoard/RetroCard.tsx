import React from "react";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import { Box, Stack, Text } from "@chakra-ui/layout";
import {
  Avatar,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FiStar } from "react-icons/fi";
import styled from "styled-components";
import { Item } from "utils/interfaces";
import EditItem from "./RetroItem/EditItem";
import { firestore } from "configs/firebase/firestore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
import { useRetroContext } from "context/RetroBoard/RetroBoardContext";
import { RetroItemEditDelete } from "./RetroItemEditDelete";
interface Props {
  listColour: string;
  item: Item;
  children?: React.ReactChild;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}

const StyledIconAction = styled.div<{ hoverColor?: string; color?: string }>`
  color: ${(props) => props.color};
  cursor: pointer;
  transition: color 100ms linear;
  &:hover {
    color: ${(props) => props.hoverColor};
  }
`;

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
          userId={item?.userId}
          itemId={item.itemId}
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
}: {
  userId: string;
  itemId: string;
  openEditBox: () => void;
  itemUpvotes: string[];
}) => {
  const { user } = useAuthContext();

  const allowEditAndDelete = user?.uid === userId;

  return (
    <>
      <Box
        display="flex"
        gridGap="15px"
        padding="5px 0 0 0"
        justifyContent="center"
        alignItems="center"
      >
        <RetroItemMemberToolTip userId={userId} />
        {allowEditAndDelete && (
          <RetroItemEditDelete itemId={itemId} openEditBox={openEditBox} />
        )}
        <RetroItemUpvote itemId={itemId} itemUpvotes={itemUpvotes} />
      </Box>
    </>
  );
};

const RetroItemUpvote = ({
  itemId,
  itemUpvotes,
}: {
  itemId: string;
  itemUpvotes: string[];
}) => {
  const bg = useColorModeValue("black", "gray.600");

  const lightOrDarkStarBg = useColorModeValue("#F91880", "#FBBD08");
  const { user } = useAuthContext();
  const isUpvoted = user && itemUpvotes.includes(user.uid);

  const toggleUpvote = async () => {
    if (user) {
      const itemRef = doc(firestore, "items", itemId);
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
        <Avatar size="xs" name={label} />
      </Tooltip>
    </div>
  );
};

export default RetroCard;
