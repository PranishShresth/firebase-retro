import React from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input, InputGroup } from "@chakra-ui/input";
import { Stack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { darken } from "@chakra-ui/theme-tools";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "configs/firebase/firestore";
import { calculateInitialListPosition } from "utils/dragAndDropUtils";
import { useBoard } from "context/RetroBoard/RetroBoardContext";
import { ColourPicker } from "components/ColourPicker";
import { AiOutlineUnorderedList } from "react-icons/ai";
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  IconButton,
  ModalOverlay,
  useColorMode,
  Modal,
  useMediaQuery,
} from "@chakra-ui/react";

interface FormValues {
  listColour: string;
  listTitle: string;
}
export const RetroColumnCreate = () => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const {
    board: { lists },
  } = useBoard();
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
    formState: { isDirty, isValid },
  } = useForm<FormValues>({
    defaultValues: {
      listColour: colorMode === "light" ? "#000000" : "#F2F2F2",
      listTitle: "",
    },
    mode: "onChange",
  });

  const [isMobile] = useMediaQuery("(max-width: 768px)");

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
      {isMobile ? (
        <IconButton
          onClick={openListModal}
          aria-label="Create column"
          icon={<AiOutlineUnorderedList />}
        />
      ) : (
        <Button
          onClick={openListModal}
          background="#CFFF18"
          color="black"
          _hover={{ backgroundColor: darken("#CFFF18", 8) }}
          padding="0px 24px 0px 24px"
          fontWeight="normal"
        >
          Add a column
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={closeListModal}>
        <ModalOverlay />
        <ModalContent margin="3.75rem 1rem">
          <ModalHeader>Add a column</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
                      rules={{ required: true }}
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
                  <Button
                    background="#00B5AD"
                    color="white"
                    disabled={!isDirty || !isValid}
                    _hover={{ backgroundColor: darken("#00B5AD", 8) }}
                    marginBottom="12px"
                    marginTop="16px"
                    width="100%"
                    type="submit"
                  >
                    Create List&nbsp;
                    <AiOutlineUnorderedList />
                  </Button>
                </div>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
