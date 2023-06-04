import {
  Button,
  ButtonGroup,
  IconButton,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { firestore } from "configs/firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { Controller, useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { useIsDarkMode } from "utils/color";
import { RetroTextArea } from "./RetroTextArea";

interface Props {
  isOpen: boolean;
  content: string;
  itemId: string;
  closeEditMode: () => void;
}

interface FormValues {
  itemTitle: string;
}
function EditItem({ isOpen, closeEditMode, content, itemId }: Props) {
  const bg = useColorModeValue("white", "gray.600");
  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      itemTitle: content,
    },
  });
  const isDarkMode = useIsDarkMode();

  const handleEditingItem = async (data: FormValues) => {
    try {
      const itemRef = doc(firestore, "items", itemId);
      await updateDoc(itemRef, { ...data });
      closeEditMode();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {isOpen && (
        <form
          onSubmit={handleSubmit(handleEditingItem)}
          style={{ marginBottom: 16 }}
        >
          <Stack spacing={2}>
            <Controller
              control={control}
              name="itemTitle"
              render={({ field }) => (
                <RetroTextArea
                  {...field}
                  $isDarkMode={isDarkMode}
                  placeholder="Add a Item"
                  resize="none"
                  focusBorderColor="blue.500"
                  background={bg}
                />
              )}
            />
            <ButtonGroup size="sm" isAttached variant="outline">
              <Button type="submit" colorScheme="facebook">
                Save
              </Button>
              <IconButton
                aria-label="Close Edit"
                icon={<IoMdClose />}
                onClick={closeEditMode}
              />
            </ButtonGroup>
          </Stack>
        </form>
      )}
    </>
  );
}

export default EditItem;
