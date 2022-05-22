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
  useColorModeValue,
  MenuItemOption,
  MenuOptionGroup,
} from "@chakra-ui/react";
import { AlertDialogBar } from "components/Alert";
import React, { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { FiMoreVertical } from "react-icons/fi";
import { doc, deleteDoc, writeBatch, setDoc } from "firebase/firestore";
import { firestore } from "configs/firebase/firestore";
import { Modal as MoveModal } from "components/Modal";
import { useRetroContext } from "context/RetroBoard/RetroBoardContext";
import { Controller, useForm } from "react-hook-form";
import { v4 as uuidV4 } from "uuid";
import { useToast } from "@chakra-ui/react";
import { throttle } from "lodash-es";

interface Props {
  list_id: string;
}
const RetroListMenu = ({ list_id }: Props) => {
  const bg = useColorModeValue("gray.600", "white");
  const {
    isOpen: isDeleteDialogOpen,
    onClose: closeDeleteDialog,
    onOpen: openDeleteDialog,
  } = useDisclosure();
  const {
    board: { items },
  } = useRetroContext();
  const {
    isOpen: isMoveModalOpen,
    onClose: closeMoveModal,
    onOpen: openMoveModal,
  } = useDisclosure();

  const deleteList = async () => {
    try {
      const listRef = doc(firestore, "lists", list_id);
      const batch = writeBatch(firestore);
      const allListItems = items.filter((item) => item.list_id === list_id);
      allListItems.forEach((item) => {
        const ref = doc(firestore, "items", item.item_id);
        batch.delete(ref);
      });
      await batch.commit();
      deleteDoc(listRef);
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
          icon={<FiMoreVertical />}
          color={bg}
        ></MenuButton>
        <MenuList color={bg}>
          <MenuOptionGroup defaultValue="asc" title="Order" type="radio">
            <MenuItemOption fontSize="sm" value="asc">
              Ascending
            </MenuItemOption>
            <MenuItemOption fontSize="sm" value="desc">
              Descending
            </MenuItemOption>
          </MenuOptionGroup>
          <MenuItem fontSize="sm" onClick={openMoveModal}>
            Include column in:
          </MenuItem>
          <MenuItem fontSize="sm" onClick={openDeleteDialog}>
            Delete
          </MenuItem>
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

  const [loading, setLoading] = useState(false);
  const { getValues, control } = useForm<{ board_id: string }>({
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
      setLoading(true);
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

      setLoading(false);
      toast({
        title: "List Added.",
        description: `The list has been included...`,
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
      modalTitle="Include this list in"
      isOpen={isMoveModalOpen}
      onClose={closeMoveModal}
      onOpen={openMoveModal}
    >
      <Stack direction="column" spacing={5}>
        <Controller
          control={control}
          name="board_id"
          render={({ field }) => (
            <Select placeholder="Lists..." {...field}>
              {allBoards.slice(0, 6)?.map((board) => (
                <option key={board.board_id} value={board.board_id}>
                  {board.board_title}
                </option>
              ))}
            </Select>
          )}
        />

        <Box onClick={throttle(copyListToAnotherBoard, 4000)}>
          <Button isLoading={loading} isFullWidth={false}>
            Add
          </Button>
        </Box>
      </Stack>
    </MoveModal>
  );
};

export default RetroListMenu;
