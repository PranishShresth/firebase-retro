import React from "react";
import { Stack, InputGroup, Input, Button } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { Modal } from "components/Modal";
import { firestore } from "configs/firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { Board } from "utils/interfaces";

interface Props {
  isEditModalOpen: boolean;
  closeEditBoardModal: () => void;
  openEditBoardModal: () => void;
  board: Board;
}

interface FormValues {
  board_title: string;
  board_limit: number;
}

const EditBoard = ({
  isEditModalOpen,
  closeEditBoardModal,
  openEditBoardModal,
  board,
}: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      board_title: board.board_title,
      board_limit: board.board_limit,
    },
  });

  const handleEditBoard = async (data: FormValues) => {
    try {
      const boardRef = doc(firestore, "boards", board.board_id);

      await setDoc(boardRef, data);
    } catch (err) {
      console.log(err);
    } finally {
      closeEditBoardModal();
    }
  };

  return (
    <div>
      <Modal
        modalTitle="Edit Board Details"
        isOpen={isEditModalOpen}
        onOpen={openEditBoardModal}
        onClose={closeEditBoardModal}
      >
        <form onSubmit={handleSubmit(handleEditBoard)}>
          <Stack spacing={3}>
            <InputGroup>
              <Controller
                control={control}
                name="board_title"
                render={({ field }) => <Input {...field} />}
              />
            </InputGroup>
            <InputGroup>
              <Controller
                control={control}
                name="board_limit"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    // value={board.board_limit}
                    placeholder="Number of cards"
                  />
                )}
              />
            </InputGroup>

            <div>
              <Button type="submit">Update board</Button>
            </div>
          </Stack>
        </form>
      </Modal>
    </div>
  );
};

export default EditBoard;
