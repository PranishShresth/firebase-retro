import { IconButton, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { AlertDialogBar } from "components/Alert";
import { firestore } from "configs/firebase/firestore";
import { deleteDoc, doc } from "firebase/firestore";
import DeleteIcon from "icons/DeleteIcon";
import { LIGHT_GREEN_COLOR } from "utils/constants";

export const RetroItemDelete = ({ itemId }: { itemId: string }) => {
  const {
    isOpen: isDeleteDialogOpen,
    onClose: closeDeleteDialog,
    onOpen: openDeleteDialog,
  } = useDisclosure();
  const bg = useColorModeValue("#f2f2f2", "#0D131A");
  const borderBg = useColorModeValue("#DADADA", "#1C2A3A");
  const fillColor = useColorModeValue("#0D131A", LIGHT_GREEN_COLOR);

  const deleteItem = async () => {
    try {
      const itemRef = doc(firestore, "items", itemId);
      await deleteDoc(itemRef);
    } catch {
      console.log("err");
    }
  };
  return (
    <>
      <IconButton
        onClick={openDeleteDialog}
        aria-label="Delete item"
        icon={<DeleteIcon fill={fillColor} />}
        isRound
        size="sm"
        border={`1px solid ${borderBg}`}
        background={bg}
      />
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
