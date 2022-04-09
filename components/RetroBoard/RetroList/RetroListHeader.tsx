import React, { useState } from "react";
import styled from "styled-components";
import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "configs/firebase/firestore";
import RetroListMenu from "./RetroListMenu";
import { Board } from "utils/interfaces";

const ListTitleWrapper = styled.div`
  align-items: center;
  display: flex;
`;

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

const Square = styled.div`
  background-color: ${({ list_colour }: { list_colour: string }) =>
    list_colour};
  border-radius: 4px;
  height: 16px;
  margin-right: 8px;
  width: 16px;
`;

interface Props {
  list_colour: string | undefined;
  list_id: string;
  list_title: string;
}

interface FormValues {
  list_title: string;
}
export default function RetroListHeader({
  list_colour,
  list_id,
  list_title,
}: Props) {
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
          <ListTitleWrapper onClick={() => setEditMode(true)}>
            <Square list_colour={list_colour ?? "#000000"} />
            {list_title}
          </ListTitleWrapper>
          <RetroListMenu list_id={list_id} />
        </RetroColumnHeader>
      )}
    </>
  );
}
