import React, { useState } from "react";
import styled from "styled-components";
import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "configs/firebase/firestore";
import RetroListMenu from "./RetroListMenu";
import { Board } from "utils/interfaces";

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
    getValues,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      list_title: list_title,
    },
  });

  const [editMode, setEditMode] = useState(false);

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
          <RetroListMenu list_id={list_id} />
        </RetroColumnHeader>
      )}
    </>
  );
}
