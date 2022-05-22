import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input, InputGroup } from "@chakra-ui/input";
import { Stack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Modal } from "components/Modal";
import { v4 as uuidv4 } from "uuid";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "configs/firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
import { calculateInitialListPosition } from "utils/dragAndDropUtils";
import { useRetroContext } from "context/RetroBoard/RetroBoardContext";
import { ColourPicker } from "components/ColourPicker";

interface FormValues {
  list_colour: string;
  list_title: string;
}
const CreateList = () => {
  const router = useRouter();
  const { user } = useAuthContext();
  const {
    board: { lists },
  } = useRetroContext();
  const boardId = "" + router.query.boardId;
  const {
    isOpen,
    onOpen: openListModal,
    onClose: closeListModal,
  } = useDisclosure();

  const { handleSubmit, control, resetField } = useForm<FormValues>({
    defaultValues: {
      list_colour: "#000000",
      list_title: "",
    },
  });

  const handleCreateList = async (data: FormValues) => {
    if (data.list_title.length < 1) {
      return;
    }
    const doc_id = uuidv4();
    try {
      const list_order = calculateInitialListPosition(lists);
      const ref = doc(firestore, "lists", doc_id);
      await setDoc(ref, {
        ...data,
        list_id: doc_id,
        user_id: user?.uid,
        board_id: boardId,
        list_order,
        createdAt: serverTimestamp(),
      });
      resetField("list_title");
      closeListModal();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Modal
        modalTitle="List Creation"
        triggerName="Create"
        isOpen={isOpen}
        onClose={closeListModal}
        onOpen={openListModal}
      >
        <form onSubmit={handleSubmit(handleCreateList)}>
          <Stack spacing={3}>
            <div>
              <span>Title:</span>
              <InputGroup marginTop="4px">
                <Controller
                  control={control}
                  name="list_title"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="List Title"
                      required
                      type="text"
                      value={field.value}
                    />
                  )}
                />
              </InputGroup>
            </div>
            <div>
              <span>Colour:</span>
              <Controller
                control={control}
                name="list_colour"
                render={({ field }) => <ColourPicker field={field} />}
              />
            </div>
            <div>
              <Button marginBottom="12px" type="submit">
                Create List
              </Button>
            </div>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default CreateList;
