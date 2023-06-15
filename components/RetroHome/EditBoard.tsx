import { Button, Input, InputGroup, Stack } from "@chakra-ui/react";
import { ColourPicker } from "components/ColourPicker";
import { Modal } from "components/Modal";
import { firestore } from "configs/firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Board } from "utils/interfaces";

interface Props {
  isEditModalOpen: boolean;
  closeEditBoardModal: () => void;
  openEditBoardModal: () => void;
  board: Board;
}

interface FormValues {
  boardTitle: string;
  boardColor: string;
}

const EditBoard = ({
  isEditModalOpen,
  closeEditBoardModal,
  openEditBoardModal,
  board,
}: Props) => {
  const { handleSubmit, control, formState } = useForm<FormValues>({
    defaultValues: {
      boardTitle: board.boardTitle,
      boardColor: board.boardColour,
    },
  });

  const handleEditBoard = async (data: FormValues) => {
    try {
      const boardRef = doc(firestore, "boards", board.boardId);
      await updateDoc(boardRef, { ...data });
      closeEditBoardModal();
    } catch (err) {
      console.log(err);
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
                name="boardTitle"
                render={({ field }) => <Input {...field} />}
              />
            </InputGroup>

            <div>
              <span>Colour:</span>
              <Controller
                control={control}
                name="boardColor"
                render={({ field }) => <ColourPicker field={field} />}
              />
            </div>

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
