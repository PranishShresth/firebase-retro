import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { Input } from "@chakra-ui/input";
import { FaTrash } from "react-icons/fa";
import { Box, Icon, useDisclosure } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
// import DeleteAlert from "./AlertDialog";

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
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      list_title: list_title,
    },
  });

  const [editMode, setEditMode] = useState(false);

  const updateList = () => {
    // if (formValues.list_title.length < 1) {
    //   return;
    // }
    // dispatch({
    //   type: "UPDATE_LIST_REQUESTED",
    //   payload: { list_id, ...formValues },
    // });
    // dispatch(listActions.updateList({ _id: list_id, ...formValues }));
    // setEditMode(false);
  };

  const deleteList = () => {
    // dispatch({ type: "DELETE_LIST_REQUESTED", payload: { list_id } });
    // dispatch(listActions.removeList({ _id: list_id }));
  };

  const handleUpdateList = (ev: React.KeyboardEvent) => {
    try {
      const { key } = ev as React.KeyboardEvent<HTMLInputElement>;
      if (key === "Enter") {
        return updateList();
      }
    } catch (err) {}
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
                // onChange={handleChange}
                // onBlur={handleSubmit}
                onKeyDown={handleUpdateList}
              />
            )}
          />
        </Box>
      ) : (
        <RetroColumnHeader>
          <div onClick={() => setEditMode(true)}>{list_title} sadasdas</div>
          <Icon
            as={FaTrash}
            size="mini"
            onClick={openDeleteDialog}
            style={{ cursor: "pointer", fontSize: 14 }}
          />
        </RetroColumnHeader>
      )}

      {/* <DeleteAlert
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onClick={deleteList}
        title="Delete Column"
      /> */}
    </>
  );
}
