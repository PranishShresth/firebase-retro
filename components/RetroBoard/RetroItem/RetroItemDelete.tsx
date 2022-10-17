import { firestore } from "configs/firebase/firestore";
import { AlertDialogBar } from "components/Alert";
import { useDisclosure, IconButton } from "@chakra-ui/react";
import { deleteDoc, doc } from "firebase/firestore";
import Image from "next/image";

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
        icon={<Image width={14} height={14} src="/Delete.svg" alt="delete" />}
        isRound
        size="xs"
        background="#0D131A"
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
