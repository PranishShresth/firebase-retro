import { Button, useColorModeValue } from "@chakra-ui/react";
import { firestore } from "configs/firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { Controller, useForm } from "react-hook-form";
import { IoIosSend } from "react-icons/io";
import styled from "styled-components";
import { useIsDarkMode } from "utils/color";
import { Item } from "utils/interfaces";
import { v4 as uuidv4 } from "uuid";
import { RetroCommentList } from "./RetroCommentList";
import { RetroTextArea } from "./RetroTextArea";

interface FormValues {
  itemComment: string;
}

interface Props {
  item: Item;
}

export const RetroComment = ({ item }: Props) => {
  const isDarkMode = useIsDarkMode();
  const textareaBg = useColorModeValue("white", "gray.600");
  const { user } = useAuthContext();
  const { handleSubmit, control, resetField, watch } = useForm<FormValues>({
    defaultValues: {
      itemComment: "",
    },
  });
  const watchItemComment = watch("itemComment");

  const handleAddingComment = async (data: FormValues) => {
    const comment_id = uuidv4();

    try {
      if (user) {
        const itemRef = doc(firestore, "items", item.itemId);

        resetField("itemComment");

        await updateDoc(itemRef, {
          comments: arrayUnion({
            userId: user?.uid,
            message: data.itemComment,
            commentId: comment_id,
          }),
        });

        // scroll to the element after it is added
        document
          .getElementById(comment_id)
          ?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <CommentInputWrapper>
      <CommentForm onSubmit={handleSubmit(handleAddingComment)}>
        <Controller
          control={control}
          name="itemComment"
          render={({ field }) => (
            <RetroTextArea
              {...field}
              $isDarkMode={isDarkMode}
              placeholder="Enter your comment..."
              resize="none"
              focusBorderColor="blue.500"
              background={textareaBg}
              minHeight="40px"
            />
          )}
        />
        <Button
          type="submit"
          disabled={watchItemComment.length === 0}
          colorScheme="facebook"
          padding={0}
        >
          <IoIosSend size={24} />
        </Button>
      </CommentForm>
      {item.comments &&
        item.comments.map(({ commentId, message, userId }) => {
          return (
            <RetroCommentList
              commentId={commentId}
              comments={item.comments}
              item={item}
              key={commentId}
              message={message}
              userId={userId}
            />
          );
        })}
    </CommentInputWrapper>
  );
};

const CommentInputWrapper = styled.div`
  margin-top: 24px;
  padding: 12px;
`;

const CommentForm = styled.form`
  column-gap: 8px;
  display: flex;
`;
