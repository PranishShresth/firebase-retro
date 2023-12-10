import { Box, useDisclosure } from "@chakra-ui/react";
import { useAuthContext } from "context/Auth/AuthContext";
import styled from "styled-components";
import { useIsDarkMode } from "utils/color";
import { Comment, Item } from "utils/interfaces";
import EditComment from "./EditComment";
import { RetroCommentDelete } from "./RetroCommentDelete";
import { RetroCommentEdit } from "./RetroCommentEdit";
import { RetroItemMemberToolTip } from "./RetroItemMemberTooltip";

interface Props {
  commentId: string;
  comments: Comment[];
  item: Item;
  message: string;
  userId: string;
}

export const RetroCommentList = ({
  commentId,
  comments,
  item,
  message,
  userId,
}: Props) => {
  const isDarkMode = useIsDarkMode();
  const {
    isOpen: isEditCommentOpen,
    onClose: closeEditComment,
    onOpen: openEditCommentBox,
  } = useDisclosure();
  const { user } = useAuthContext();
  const allowEditAndDelete = user?.uid === userId;

  return (
    <Comments $isDarkMode={isDarkMode} id={commentId} key={commentId}>
      <RetroItemMemberToolTip avatarSize="xs" userId={userId} />
      {isEditCommentOpen ? (
        <EditComment
          itemId={item.itemId}
          comments={comments}
          commentId={commentId}
          content={message}
          closeEditMode={closeEditComment}
        />
      ) : (
        <Box flex={1} marginLeft={3} marginRight={3}>
          {message}
        </Box>
      )}
      {allowEditAndDelete && !isEditCommentOpen && (
        <CommentActionWrapper>
          <RetroCommentEdit openEditBox={openEditCommentBox} />
          <RetroCommentDelete
            message={message}
            itemId={item.itemId}
            commentId={commentId}
          />
        </CommentActionWrapper>
      )}
    </Comments>
  );
};

const CommentActionWrapper = styled.div`
  display: flex;
  column-gap: 4px;
`;

const Comments = styled.div<{ $isDarkMode: boolean }>`
  align-items: center;
  border-bottom: ${({ $isDarkMode }) =>
    `1px solid ${$isDarkMode ? "#343f4d" : "#E2E8F0"}`};
  display: flex;
  padding: 12px 0;
`;
