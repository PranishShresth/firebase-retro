import {
  Box,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { AlertDialogBar } from "components/Alert";
import { firestore } from "configs/firebase/firestore";
import { format } from "date-fns";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import Link from "next/link";
import React, { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import styled from "styled-components";
import { BoardWithDocId } from "utils/interfaces";
import EditBoard from "./EditBoard";

interface Props {
  board: BoardWithDocId;
}

const DateCreated = styled.div`
  font-size: 12px;
  margin-top: 8px;
`;

const Grid = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BoardCard = ({ board }: Props) => {
  const [deleteModalOpen, setdeleteModalOpen] = useState(false);
  const [deleteBoardProgressing, setDeleteBoardProgressing] = useState(false);
  const {
    isOpen: isEditModalOpen,
    onClose: closeEditBoardModal,
    onOpen: openEditBoardModal,
  } = useDisclosure();
  const bg = useColorModeValue("white", "#1C2A3A");

  const handleDeleteBoard = async () => {
    try {
      setDeleteBoardProgressing(true);
      const currentBoardRef = doc(firestore, "boards", board.doc_id);
      const batch = writeBatch(firestore);
      const itemsQ = query(
        collection(firestore, "items"),
        where("boardId", "==", board.boardId)
      );
      const listsQ = query(
        collection(firestore, "lists"),
        where("boardId", "==", board.boardId)
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

      await deleteDoc(currentBoardRef);
      setDeleteBoardProgressing(false);
      setdeleteModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      position="relative"
      _focus={{ boxShadow: "outline" }}
      _focusVisible={{ boxShadow: "outline" }}
    >
      <Link href={`/board/${board.boardId}`} passHref>
        <a>
          <Box
            backgroundColor={bg}
            boxShadow="rgb(0 0 0 / 20%) 0px 1px 3px"
            borderTop={`0.5rem solid ${board.boardColour ?? "#000000"}`}
            minHeight="60px"
            overflow="hidden"
            padding="1rem"
            height="100%"
          >
            <Grid>
              <Text
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="bold"
                maxWidth="90%"
              >
                {board.boardTitle}
              </Text>
            </Grid>
            <DateCreated>
              {board.createdAt &&
                format(new Date(board.createdAt.seconds * 1000), "dd/MM/yyyy")}
            </DateCreated>
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
              isLoading={deleteBoardProgressing}
              title="Delete Board"
              ariaLabel="Delete Board Alert"
            />
          </Box>
        </a>
      </Link>
      <Menu>
        <MenuButton
          background="none !important"
          borderRadius="sm"
          position="absolute"
          right="1em"
          top="1.5em"
          transition="all 0.2s"
          _focus={{ boxShadow: "outline" }}
        >
          <Icon as={FaEllipsisV} size={16} />
        </MenuButton>
        <MenuList>
          <MenuItem onClick={openEditBoardModal}>Edit</MenuItem>
          <MenuItem color="#E53E3E" onClick={() => setdeleteModalOpen(true)}>
            Delete
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default BoardCard;
