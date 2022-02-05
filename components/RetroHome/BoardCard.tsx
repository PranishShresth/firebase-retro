import styled from "styled-components";
import React, { useState } from "react";
import AlertDialog from "components/Alert/AlertDialog";
import Modal from "components/Modal/Modal";
import Link from "next/link";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Icon,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { FaEllipsisV } from "react-icons/fa";
import { deleteDoc, doc } from "firebase/firestore";
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
      await deleteDoc(currentBoardRef);
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
            <a>
              <Text fontSize="lg" color="#4b5489" fontWeight="700">
                {board.board_title}
              </Text>
            </a>
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

        <AlertDialog
          isOpen={deleteModalOpen}
          onClose={() => setdeleteModalOpen(false)}
          onClick={handleDeleteBoard}
          title="Delete Board"
        />
      </Box>
    </>
  );
};

export default BoardCard;
