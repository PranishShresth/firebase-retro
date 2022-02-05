import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input, InputGroup } from "@chakra-ui/input";
import { Stack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Modal from "components/Modal/Modal";
import { v4 as uuidv4 } from "uuid";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "configs/firebase/firestore";
interface FormValues {
  list_title: string;
}
const CreateList = () => {
  const router = useRouter();
  const boardId = "" + router.query.boardId;
  const {
    isOpen,
    onOpen: openListModal,
    onClose: closeListModal,
  } = useDisclosure();

  const {
    handleSubmit,
    control,
    resetField,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      list_title: "",
    },
  });

  const handleCreateList = async (data: FormValues) => {
    if (data.list_title.length < 1) {
      return;
    }
    const doc_id = uuidv4();
    try {
      const ref = doc(firestore, "lists", doc_id);
      await setDoc(ref, {
        ...data,
        list_id: doc_id,
        board_id: boardId,
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
            <InputGroup>
              <Controller
                control={control}
                name="list_title"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="List Title"
                    value={field.value}
                  />
                )}
              />
            </InputGroup>
            <div>
              <Button type="submit">Create List</Button>
            </div>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default CreateList;
