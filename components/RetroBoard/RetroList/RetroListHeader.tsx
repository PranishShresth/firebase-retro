import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { Input } from "@chakra-ui/input";
import { FaTrash } from "react-icons/fa";
import { Box, Icon, useDisclosure } from "@chakra-ui/react";
import { Controller, useForm, useFormState } from "react-hook-form";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { firestore } from "configs/firebase/firestore";
import { AlertDialogBar } from "components/Alert";

const RetroColumnHeader = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  display: flex;
  color: #58585a;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0px;
  margin: 0 4px;
`;

interface Props {
  list_title: string;
  list_id: string;
}

interface FormValues {
  list_title: string;
}
export default function RetroListHeader({ list_title, list_id }: Props) {
  const {
    isOpen: isDeleteDialogOpen,
    onClose: closeDeleteDialog,
    onOpen: openDeleteDialog,
  } = useDisclosure();

  const {
    getValues,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      list_title: list_title,
    },
  });

  const [editMode, setEditMode] = useState(false);

  const deleteList = async () => {
    try {
      const itemRef = doc(firestore, "lists", list_id);
      await deleteDoc(itemRef);
    } catch {
      console.log("err");
    }
  };

  const handleUpdateList = async (ev: React.KeyboardEvent) => {
    const { key } = ev as React.KeyboardEvent<HTMLInputElement>;
    if (key === "Enter") {
      try {
        const list_title = getValues("list_title");
        const listRef = doc(firestore, "lists", list_id);
        setEditMode(false);
        await updateDoc(listRef, { list_title });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      {editMode ? (
        <Box padding="24px 0">
          <Controller
            control={control}
            name="list_title"
            render={({ field }) => (
              <Input
                {...field}
                autoFocus
                fontWeight="bold"
                variant="filled"
                placeholder="List Title"
                // onBlur={handleUpdateList}
                onKeyDown={handleUpdateList}
              />
            )}
          />
        </Box>
      ) : (
        <RetroColumnHeader>
          <div onClick={() => setEditMode(true)}>{list_title}</div>
          <Icon
            as={FaTrash}
            size="mini"
            onClick={openDeleteDialog}
            style={{ cursor: "pointer", fontSize: 14 }}
          />
        </RetroColumnHeader>
      )}

      <AlertDialogBar
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onClick={deleteList}
        title="Delete Column"
        ariaLabel="Delete List Dialogue"
      />
    </>
  );
}
