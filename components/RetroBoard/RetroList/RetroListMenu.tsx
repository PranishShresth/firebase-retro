import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Stack,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { AlertDialogBar } from "components/Alert";
import React from "react";
import { useDisclosure } from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa";
import { doc, deleteDoc, writeBatch, setDoc } from "firebase/firestore";
import { firestore } from "configs/firebase/firestore";
import { Modal as MoveModal } from "components/Modal";
import { useRetroContext } from "context/RetroBoard/RetroBoardContext";
import { Controller, useForm } from "react-hook-form";
import { v4 as uuidV4 } from "uuid";
import { useToast } from "@chakra-ui/react";

interface Props {
  list_id: string;
}
const RetroListMenu = ({ list_id }: Props) => {
  const {
    isOpen: isDeleteDialogOpen,
    onClose: closeDeleteDialog,
    onOpen: openDeleteDialog,
  } = useDisclosure();

  const {
    isOpen: isMoveModalOpen,
    onClose: closeMoveModal,
    onOpen: openMoveModal,
  } = useDisclosure();

  const deleteList = async () => {
    try {
      const itemRef = doc(firestore, "lists", list_id);

      await deleteDoc(itemRef);
    } catch {
      console.log("err");
    }
  };

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<FaChevronDown />}
        ></MenuButton>
        <MenuList>
          {/* <MenuItem>Download</MenuItem> */}
          <MenuItem onClick={openMoveModal}>Move List</MenuItem>
          <MenuItem onClick={openDeleteDialog}>Delete</MenuItem>
        </MenuList>
      </Menu>

      <MoveListContainer
        isMoveModalOpen={isMoveModalOpen}
        closeMoveModal={closeMoveModal}
        openMoveModal={openMoveModal}
        list_id={list_id}
      />
      <AlertDialogBar
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onClick={deleteList}
        title="Delete Column"
        ariaLabel="Delete List Dialogue"
      />
    </>
  );
};

const MoveListContainer = ({
  isMoveModalOpen,
  closeMoveModal,
  openMoveModal,
  list_id,
}: {
  isMoveModalOpen: boolean;
  closeMoveModal: () => void;
  openMoveModal: () => void;
  list_id: string;
}) => {
  const {
    board: { allBoards, items, lists },
  } = useRetroContext();
  const toast = useToast();

  const {
    getValues,
    control,
    formState: { errors },
  } = useForm<{ board_id: string }>({
    defaultValues: {
      board_id: "",
    },
  });

  const copyListToAnotherBoard = async () => {
    const boardId = getValues("board_id");
    if (boardId === "") return;
    const allItems = items.filter((item) => item.list_id === list_id);
    const list = lists.find((list) => list.list_id === list_id);
    if (!list) return;

    try {
      const list_id = uuidV4();

      const batch = writeBatch(firestore);

      allItems.forEach((item) => {
        const i_id = uuidV4();
        batch.set(doc(firestore, "items", i_id), {
          ...item,
          board_id: boardId,
          item_id: i_id,
          list_id: list_id,
        });
      });

      await setDoc(doc(firestore, "lists", list_id), {
        ...list,
        board_id: boardId,
        list_id: list_id,
      });
      await batch.commit();

      toast({
        title: "List Moved.",
        description: `The list has been moved to ${boardId}`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MoveModal
      modalTitle="Move a List"
      isOpen={isMoveModalOpen}
      onClose={closeMoveModal}
      onOpen={openMoveModal}
    >
      <Stack direction="column" spacing={5}>
        <Controller
          control={control}
          name="board_id"
          render={({ field }) => (
            <Select placeholder="Select Board to Move List" {...field}>
              {allBoards?.map((board) => (
                <option key={board.board_id} value={board.board_id}>
                  {board.board_title}
                </option>
              ))}
            </Select>
          )}
        />

        <Box onClick={copyListToAnotherBoard}>
          <Button isFullWidth={false}>Move List</Button>
        </Box>
      </Stack>
    </MoveModal>
  );
};

export default RetroListMenu;
