import { firestore } from "configs/firebase/firestore";
import { AlertDialogBar } from "components/Alert";
import { useDisclosure, IconButton } from "@chakra-ui/react";
import { deleteDoc, doc } from "firebase/firestore";
import DeleteIcon from "icons/DeleteIcon";

export const RetroItemDelete = ({ itemId }: { itemId: string }) => {
  const {
    isOpen: isDeleteDialogOpen,
    onClose: closeDeleteDialog,
    onOpen: openDeleteDialog,
  } = useDisclosure();

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
        icon={<DeleteIcon fill="#F2F2F2" />}
        isRound
        size="xs"
        background="#0D131A"
        x
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
