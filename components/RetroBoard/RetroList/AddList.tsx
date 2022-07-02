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
  listColour: string;
  listTitle: string;
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
      listColour: "#000000",
      listTitle: "",
    },
  });

  const handleCreateList = async (data: FormValues) => {
    if (data.listTitle.length < 1) {
      return;
    }
    const doc_id = uuidv4();
    try {
      const listOrder = calculateInitialListPosition(lists);
      const ref = doc(firestore, "lists", doc_id);
      await setDoc(ref, {
        ...data,
        listId: doc_id,
        boardId: boardId,
        listOrder,
        createdAt: serverTimestamp(),
      });
      resetField("listTitle");
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
                  name="listTitle"
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
                name="listColour"
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
