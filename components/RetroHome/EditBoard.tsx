import React from "react";
import {
  Stack,
  InputGroup,
  Input,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import Modal from "components/Modal/Modal";

const EditBoard = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<{ board_title: string; board_limit: number }>();

  const handleEditBoard = (data: {
    board_title: string;
    board_limit: number;
  }) => {
    try {
      onClose();
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  return (
    <div>
      <Modal
        modalTitle="Edit Board Details"
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      >
        <form onSubmit={handleSubmit(handleEditBoard)}>
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
    </div>
  );
};

export default EditBoard;
