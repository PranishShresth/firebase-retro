import React, { useState } from "react";
import styled from "styled-components";
import { Input } from "@chakra-ui/input";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "configs/firebase/firestore";
import { RetroListDelete } from "./RetroListMenu";

import Sparkle from "../../Sparkle";

const ListTitleWrapper = styled(Box)`
  align-items: center;
  display: flex;
  flex: 1;
`;

const RetroColumnHeader = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  display: flex;
  color: #58585a;
  justify-content: space-between;
  align-items: center;
  margin: 24px 4px;
`;

interface Props {
  listColour: string | undefined;
  listId: string;
  listTitle: string;
}

interface FormValues {
  listTitle: string;
}
export default function RetroListHeader({
  listColour: listColour,
  listId,
  listTitle,
}: Props) {
  const {
    getValues,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      listTitle: listTitle,
    },
  });
  const color = useColorModeValue("gray.900", "white");

  const [editMode, setEditMode] = useState(false);

  const handleUpdateList = async (ev: React.KeyboardEvent) => {
    const { key } = ev as React.KeyboardEvent<HTMLInputElement>;
    if (key === "Enter") {
      try {
        const listTitle = getValues("listTitle");
        const listRef = doc(firestore, "lists", listId);
        setEditMode(false);
        await updateDoc(listRef, { listTitle });
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
            name="listTitle"
            render={({ field }) => (
              <Input
                {...field}
                autoFocus
                fontWeight="bold"
                variant="filled"
                placeholder="List Title"
                onKeyDown={handleUpdateList}
              />
            )}
          />
        </Box>
      ) : (
        <RetroColumnHeader>
          <ListTitleWrapper onClick={() => setEditMode(true)} color={color}>
            <Sparkle fill={listColour} />
            <Text fontSize="20px" marginLeft="8px" fontWeight={700}>
              {listTitle}
            </Text>
          </ListTitleWrapper>
          <RetroListDelete listId={listId} />
        </RetroColumnHeader>
      )}
    </>
  );
}
