import { Button, Textarea, Stack, IconButton } from "@chakra-ui/react";
import React, { useState, useContext } from "react";
import { FaPlus } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

import styled from "styled-components";
import { GiCrossMark } from "react-icons/gi";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "configs/firebase/firestore";

interface Props {
  list_id: string;
}

const StyledButton = styled(Button)`
  background: #f7f7f7 !important;
  border: 1px solid #e6e7e9;
  color: #b7b8ba;
`;

interface FormValues {
  item_title: string;
}
function AddItem({ list_id }: Props) {
  const router = useRouter();
  const boardId = "" + router.query.boardId;
  const {
    handleSubmit,
    control,
    resetField,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      item_title: "",
    },
  });

  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const handleAddingItem = async (data: FormValues) => {
    if (data.item_title === "") {
      return;
    }
    const doc_id = uuidv4();
    try {
      const ref = doc(firestore, "items", doc_id);
      await setDoc(ref, {
        ...data,
        item_id: doc_id,
        board_id: boardId,
        list_id: list_id,
        createdAt: serverTimestamp(),
      });
      resetField("item_title");
      setOpen(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {!open && (
        <StyledButton
          leftIcon={<FaPlus />}
          fluid
          variant="solid"
          width="100%"
          onClick={() => {
            setOpen(!open);
          }}
        >
          Item
        </StyledButton>
      )}
      {open && (
        <form onSubmit={handleSubmit(handleAddingItem)}>
          <Stack spacing={2}>
            <Controller
              control={control}
              name="item_title"
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Add a Item"
                  resize="none"
                  focusBorderColor="blue.500"
                  background="white"
                />
              )}
            />

            <Stack direction="row" spacing={2}>
              <Button leftIcon={<FaPlus />} type="submit" variant="solid">
                Create
              </Button>
              <IconButton
                aria-label="cross"
                icon={<GiCrossMark />}
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
