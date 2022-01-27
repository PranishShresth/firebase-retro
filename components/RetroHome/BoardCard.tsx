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
  Button,
  Box,
  Icon,
  Text,
  Stack,
  InputGroup,
  Input,
  useDisclosure,
} from "@chakra-ui/react";

import { FaEllipsisV } from "react-icons/fa";
import { useForm } from "react-hook-form";

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
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [deleteModalOpen, setdeleteModalOpen] = useState(false);

  const handleDeleteBoard = () => {
    setdeleteModalOpen(false);
  };

  const handleEditBoard = (ev: React.FormEvent) => {
    try {
      ev.preventDefault();

      onClose();
    } catch (err) {
      console.log(err);
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
            <Text fontSize="lg" color="#4b5489" fontWeight="700">
              {props.header}
            </Text>
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

      <Modal
        modalTitle="Edit Board Details"
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      >
        <form onSubmit={handleEditBoard}>
          <Stack spacing={3}>
            <InputGroup>
              <Input
                type="text"
                {...register("board_title", {
                  required: true,
                })}
                placeholder="Board Title"
              />
            </InputGroup>

            <div>
              <Button type="submit">Update board</Button>
            </div>
          </Stack>
        </form>
      </Modal>
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
