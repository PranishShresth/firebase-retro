import { Box, Stack } from "@chakra-ui/layout";
import {
  Avatar,
  Button,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { firestore } from "configs/firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
import { useBoard, useBoardFinal } from "context/RetroBoard/RetroBoardContext";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import React from "react";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import { Controller, useForm } from "react-hook-form";
import { IoIosSend } from "react-icons/io";
import styled, { css } from "styled-components";
import { useIsDarkMode } from "utils/color";
import { Comment, Item } from "utils/interfaces";
import { randomizeLetter } from "utils/shuffle";
import { v4 as uuidv4 } from "uuid";
import { RetroMarkDown } from "../ReactMarkdown/RetroMarkdown";
import EditItem from "./EditItem";
import { RetroItemComment } from "./RetroItemComment";
import { RetroItemCopy } from "./RetroItemCopy";
import { RetroItemDelete } from "./RetroItemDelete";
import { RetroItemEdit } from "./RetroItemEdit";
import { RetroItemLike } from "./RetroItemLike";
import { RetroTextArea } from "./RetroTextArea";

interface Props {
  listColour: string;
  item: Item;
  children?: React.ReactChild;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}

interface FormValues {
  itemComment: string;
}

const RetroItem = ({ listColour, item, provided, snapshot }: Props) => {
  const { isOpen, onClose, onOpen: openEditBox } = useDisclosure();
  const { isOpen: isCommentsExpanded, onToggle: toggleComments } =
    useDisclosure();
  const isDarkMode = useIsDarkMode();
  const bg = useColorModeValue("white", "#1C2A3A");
  const textareaBg = useColorModeValue("white", "gray.600");
  const board = useBoardFinal();
  const { user } = useAuthContext();
  const { handleSubmit, control, resetField, watch } = useForm<FormValues>({
    defaultValues: {
      itemComment: "",
    },
  });

  const isDragging = snapshot.isDragging;
  const watchItemComment = watch("itemComment");

  const hideItems = board.prefs.hideItems && item.userId !== user?.uid;
  const itemContent = hideItems
    ? randomizeLetter(item.itemTitle)
    : item.itemTitle;

  const handleAddingComment = async (data: FormValues) => {
    const comment_id = uuidv4();

    try {
      if (user) {
        const itemRef = doc(firestore, "items", item.itemId);

        resetField("itemComment");

        await updateDoc(itemRef, {
          comments: arrayUnion({
            userId: user?.uid,
            message: data.itemComment,
            commentId: comment_id,
          }),
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

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
      {isCommentsExpanded && (
        <CommentInputWrapper>
          <CommentForm onSubmit={handleSubmit(handleAddingComment)}>
            <Controller
              control={control}
              name="itemComment"
              render={({ field }) => (
                <RetroTextArea
                  {...field}
                  $isDarkMode={isDarkMode}
                  placeholder="Enter your comment..."
                  resize="none"
                  focusBorderColor="blue.500"
                  background={textareaBg}
                  minHeight="40px"
                />
              )}
            />
            <Button
              type="submit"
              disabled={watchItemComment.length === 0}
              colorScheme="facebook"
              padding={0}
            >
              <IoIosSend size={24} />
            </Button>
          </CommentForm>
          {item.comments &&
            item.comments.map(({ commentId, message }) => (
              <Comments key={commentId}>{message}</Comments>
            ))}
        </CommentInputWrapper>
      )}
    </StyledBox>
  );
};

const CommentInputWrapper = styled.div`
  margin-top: 24px;
  padding: 12px;
`;

const CommentForm = styled.form`
  column-gap: 8px;
  display: flex;
`;

const Comments = styled.div``;

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
  } = useBoard();

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
