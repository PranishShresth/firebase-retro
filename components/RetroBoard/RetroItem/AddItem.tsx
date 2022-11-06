import {
  Button,
  Textarea,
  Stack,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

import styled from "styled-components";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "configs/firebase/firestore";
import { calculateInitialItemPosition } from "utils/dragAndDropUtils";
import { useRetroContext } from "context/RetroBoard/RetroBoardContext";
import { useAuthContext } from "context/Auth/AuthContext";
import { IoMdClose } from "react-icons/io";

interface Props {
  listId: string;
}

const StyledButton = styled(Button)`
  border: 1px solid #e6e7e9;
  color: #b7b8ba;
  font-weight: normal;
`;

interface FormValues {
  itemTitle: string;
}
function AddItem({ listId }: Props) {
  const router = useRouter();
  const { member, user } = useAuthContext();
  const boardId = "" + router.query.boardId;
  const bg = useColorModeValue("#f7f7f7", "gray.900");
  const borderBg = useColorModeValue("gray.200", "gray.600");
  const textareaBg = useColorModeValue("white", "gray.600");

  const {
    board: { items },
  } = useRetroContext();

  const { handleSubmit, control, resetField } = useForm<FormValues>({
    defaultValues: {
      itemTitle: "",
    },
  });

  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const handleAddingItem = async (data: FormValues) => {
    if (data.itemTitle === "") {
      return;
    }
    const doc_id = uuidv4();
    try {
      const itemOrder = calculateInitialItemPosition(items);
      const ref = doc(firestore, "items", doc_id);

      resetField("itemTitle");

      await setDoc(ref, {
        ...data,
        itemId: doc_id,
        boardId: boardId,
        listId,
        userId: user?.uid,
        createdBy: member,
        itemUpvotes: [],
        itemOrder,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {!open && (
        <StyledButton
          variant="solid"
          width="100%"
          background={bg}
          borderColor={borderBg}
          onClick={() => {
            setOpen(!open);
          }}
        >
          Add Item
        </StyledButton>
      )}
      {open && (
        <form onSubmit={handleSubmit(handleAddingItem)}>
          <Stack spacing={2}>
            <Controller
              control={control}
              name="itemTitle"
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Add a Item"
                  resize="none"
                  focusBorderColor="blue.500"
                  background={textareaBg}
                />
              )}
            />

            <Stack direction="row" spacing={2}>
              <Button leftIcon={<FaPlus />} type="submit" variant="solid">
                Create
              </Button>
              <IconButton
                aria-label="cross"
                icon={<IoMdClose />}
                size="md"
                onClick={close}
              />
            </Stack>
          </Stack>
        </form>
      )}
    </>
  );
}

export default AddItem;
