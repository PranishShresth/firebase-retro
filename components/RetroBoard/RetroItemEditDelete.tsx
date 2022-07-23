import { firestore } from "configs/firebase/firestore";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import styled from "styled-components";
import { AlertDialogBar } from "components/Alert";
import { useDisclosure } from "@chakra-ui/react";
import { deleteDoc, doc } from "firebase/firestore";

const StyledIconAction = styled.div<{ hoverColor?: string; color?: string }>`
  color: ${(props) => props.color};
  cursor: pointer;
  transition: color 100ms linear;
  &:hover {
    color: ${(props) => props.hoverColor};
  }
`;

interface RetroItemEditDeleteProps {
  itemId: string;
  openEditBox: () => void;
}

export const RetroItemEditDelete = ({
  itemId,
  openEditBox,
}: RetroItemEditDeleteProps) => {
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
      <StyledIconAction onClick={openEditBox}>
        <FiEdit3 />
      </StyledIconAction>
      <StyledIconAction onClick={openDeleteDialog}>
        <FiTrash2 />
      </StyledIconAction>

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
