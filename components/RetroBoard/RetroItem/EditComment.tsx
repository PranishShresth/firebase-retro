import { Box, IconButton, useColorModeValue } from "@chakra-ui/react";
import { firestore } from "configs/firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { Controller, useForm } from "react-hook-form";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { useIsDarkMode } from "utils/color";
import { Comment } from "utils/interfaces";
import { RetroTextArea } from "./RetroTextArea";

interface Props {
  commentId: string;
  comments: Comment[];
  content: string;
  itemId: string;
  closeEditMode: () => void;
}

interface FormValues {
  itemComment: string;
}
function EditComment({
  closeEditMode,
  commentId,
  comments,
  content,
  itemId,
}: Props) {
  const bg = useColorModeValue("white", "gray.600");
  const borderBg = useColorModeValue("#dadada", "#1C2A3A");
  const closeIconBg = useColorModeValue("#E53E3E", "#fc0d0d");
  const saveIconBg = useColorModeValue("#28a745", "#1ddc1d");
  const iconBg = useColorModeValue("#f2f2f2", "#0D131A");
  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      itemComment: content,
    },
  });
  const isDarkMode = useIsDarkMode();
  const { user } = useAuthContext();

  const handleEditingItem = async (data: FormValues) => {
    try {
      const itemRef = doc(firestore, "items", itemId);

      // Find the index of the comment to update
      const commentIndex = comments.findIndex(
        (comment) => comment.commentId === commentId
      );

      // If the comment is found, update it; otherwise, do nothing
      if (commentIndex !== -1) {
        // Create a copy of the comments array to modify
        const updatedComments = [...comments];

        // Update the content of the specific comment
        updatedComments[commentIndex] = {
          userId: user?.uid ?? "",
          message: data.itemComment,
          commentId,
        };

        // Update the document with the modified comments array
        await updateDoc(itemRef, { comments: updatedComments });

        closeEditMode();
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(handleEditingItem)}
      style={{ display: "flex" }}
    >
      <Box margin={"0 12px"}>
        <Controller
          control={control}
          name="itemComment"
          render={({ field }) => (
            <RetroTextArea
              {...field}
              $isDarkMode={isDarkMode}
              placeholder="Add a Item"
              resize="none"
              focusBorderColor="blue.500"
              background={bg}
              height="40px"
              minHeight="40px"
            />
          )}
        />
      </Box>
      <Box display={"flex"} columnGap={"4px"} alignItems={"center"}>
        <IconButton
          type="submit"
          aria-label="Save Comment"
          icon={<IoMdCheckmark fill={saveIconBg} width={12} height={12} />}
          isRound
          size="xs"
          border={`1px solid ${borderBg}`}
          background={iconBg}
        />

        <IconButton
          onClick={closeEditMode}
          aria-label="Close Edit"
          icon={<IoMdClose fill={closeIconBg} width={12} height={12} />}
          isRound
          size="xs"
          border={`1px solid ${borderBg}`}
          background={iconBg}
        />
      </Box>
    </form>
  );
}

export default EditComment;
