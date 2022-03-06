import styled from "styled-components";
import React, { useState } from "react";
import { AlertDialogBar } from "components/Alert";
import { Modal } from "components/Modal";
import Link from "next/link";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";

import { FaEllipsisV } from "react-icons/fa";
import {
  deleteDoc,
  doc,
  query,
  collection,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "configs/firebase/firestore";
import EditBoard from "./EditBoard";
import { BoardWithDocId } from "utils/interfaces";

interface Props {
  board: BoardWithDocId;
}

const Grid = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BoardCard = ({ board }: Props) => {
  const [deleteModalOpen, setdeleteModalOpen] = useState(false);
  const {
    isOpen: isEditModalOpen,
    onClose: closeEditBoardModal,
    onOpen: openEditBoardModal,
  } = useDisclosure();

  const handleDeleteBoard = async () => {
    try {
      const currentBoardRef = doc(firestore, "boards", board.doc_id);
      const batch = writeBatch(firestore);
      const itemsQ = query(
        collection(firestore, "items"),
        where("board_id", "==", board.board_id)
      );
      const listsQ = query(
        collection(firestore, "lists"),
        where("board_id", "==", board.board_id)
      );
      const [items, lists] = await Promise.all([
        getDocs(itemsQ),
        getDocs(listsQ),
      ]);

      items.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      lists.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // commits the batched delete for both items and boards
      await batch.commit();

      deleteDoc(currentBoardRef);
    } catch (err) {
      console.log(err);
    } finally {
      setdeleteModalOpen(false);
    }
  };
  return (
    <>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        backgroundColor="white"
        padding="10px"
        height="60px"
      >
        <Grid>
          <Link href={`board/${board.board_id}`} passHref>
            <a>{board.board_title}</a>
          </Link>
          <Menu>
            <MenuButton background="none !important">
              <Icon as={FaEllipsisV} />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={openEditBoardModal}>Edit</MenuItem>
              <MenuItem>Archive</MenuItem>
              <MenuItem onClick={() => setdeleteModalOpen(true)}>
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Grid>
        <EditBoard
          isEditModalOpen={isEditModalOpen}
          closeEditBoardModal={closeEditBoardModal}
          openEditBoardModal={openEditBoardModal}
          board={board}
        />

        <AlertDialogBar
          isOpen={deleteModalOpen}
          onClose={() => setdeleteModalOpen(false)}
          onClick={handleDeleteBoard}
          title="Delete Board"
          ariaLabel="Delete Board Alert"
        />
      </Box>
    </>
  );
};

export default BoardCard;
