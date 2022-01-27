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

interface Props {
  to?: string;
  boardId: string;
  header: string;
}

const Grid = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BoardCard = (props: Props) => {
  const [deleteModalOpen, setdeleteModalOpen] = useState(false);
  const { onOpen } = useDisclosure();

  const handleDeleteBoard = async () => {
    try {
      const currentBoardRef = doc(firestore, "boards", props.boardId);
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
          <Link href={props.to ?? ""} passHref>
            <a>
              <Text fontSize="lg" color="#4b5489" fontWeight="700">
                {props.header}
              </Text>
            </a>
          </Link>
          <Menu>
            <MenuButton background="none !important">
              <Icon as={FaEllipsisV} />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={onOpen}>Edit</MenuItem>
              <MenuItem>Archive</MenuItem>
              <MenuItem onClick={() => setdeleteModalOpen(true)}>
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Grid>
      </Box>

      <EditBoard />
      <AlertDialog
        isOpen={deleteModalOpen}
        onClose={() => setdeleteModalOpen(false)}
        onClick={handleDeleteBoard}
        title="Delete Board"
      />
    </>
  );
};

export default BoardCard;
