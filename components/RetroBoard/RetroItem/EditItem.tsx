import { Button, Textarea, Stack, IconButton } from "@chakra-ui/react";
import { firestore } from "configs/firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";

interface Props {
  isOpen: boolean;
  content: string;
  item_id: string;
  onClose: () => void;
}

interface FormValues {
  item_title: string;
}
function EditItem({ isOpen, onClose, content, item_id }: Props) {
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
      const boardRef = doc(firestore, "items", item_id);
      await setDoc(boardRef, data);
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
                  background="white"
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
                onClick={onClose}
              />
            </Stack>
          </Stack>
        </form>
      )}
    </>
  );
}

export default EditItem;
