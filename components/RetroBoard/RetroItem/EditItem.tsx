import {
  Button,
  Textarea,
  Stack,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { firestore } from "configs/firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";

interface Props {
  isOpen: boolean;
  content: string;
  item_id: string;
  closeEditMode: () => void;
}

interface FormValues {
  item_title: string;
}
function EditItem({ isOpen, closeEditMode, content, item_id }: Props) {
  const bg = useColorModeValue("white", "gray.600");
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      item_title: content,
    },
  });

  const handleEditingItem = async (data: FormValues) => {
    try {
      const itemRef = doc(firestore, "items", item_id);
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
          style={{ padding: "20px 0" }}
        >
          <Stack spacing={2}>
            <Controller
              control={control}
              name="item_title"
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Add a Item"
                  resize="none"
                  focusBorderColor="blue.500"
                  background={bg}
                />
              )}
            />
            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="solid">
                Save
              </Button>

              <IconButton
                aria-label="cross"
                icon={<IoMdClose />}
                size="md"
                onClick={closeEditMode}
              />
            </Stack>
          </Stack>
        </form>
      )}
    </>
  );
}

export default EditItem;
