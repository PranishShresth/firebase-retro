import { IconButton, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { AlertDialogBar } from "components/Alert";
import { firestore } from "configs/firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import DeleteIcon from "icons/DeleteIcon";
import { LIGHT_GREEN_COLOR } from "utils/constants";

export const RetroCommentDelete = ({
  commentId,
  itemId,
  message,
}: {
  commentId: string;
  itemId: string;
  message: string;
}) => {
  const {
    isOpen: isDeleteDialogOpen,
    onClose: closeDeleteDialog,
    onOpen: openDeleteDialog,
  } = useDisclosure();
  const bg = useColorModeValue("#f2f2f2", "#0D131A");
  const borderBg = useColorModeValue("#DADADA", "#1C2A3A");
  const fillColor = useColorModeValue("#0D131A", LIGHT_GREEN_COLOR);
  const { user } = useAuthContext();

  const deleteItem = async () => {
    try {
      const itemRef = doc(firestore, "items", itemId);

      await updateDoc(itemRef, {
        comments: arrayRemove({
          userId: user?.uid,
          message,
          commentId,
        }),
      });
    } catch (error) {
      console.log("err", error);
    }
  };
  return (
    <>
      <IconButton
        onClick={openDeleteDialog}
        aria-label="Delete Comment"
        icon={<DeleteIcon fill={fillColor} width={12} height={12} />}
        isRound
        size="xs"
        border={`1px solid ${borderBg}`}
        background={bg}
      />
      <AlertDialogBar
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onClick={deleteItem}
        title="Delete Comment"
        ariaLabel="Delete Comment Dialogue"
      />
    </>
  );
};
