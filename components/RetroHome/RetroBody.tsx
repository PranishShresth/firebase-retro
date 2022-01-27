import React, { useEffect, useState } from "react";
import { Grid, Stack } from "@chakra-ui/layout";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input, InputGroup, Button, useToast, Box } from "@chakra-ui/react";
import BoardCard from "./BoardCard";
import styled from "styled-components";
import CreateBoardModal from "components/Modal/Modal";
import { firestore } from "configs/firebase/firestore";
import { collection, addDoc, onSnapshot } from "firebase/firestore"; // import Loading from "./Loader";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Board } from "utils/interfaces";
import BoardSkeleton from "components/Loader/BoardSkeleton";
import { boardsRef } from "utils/firebaseCollection";

const BoardsContainer = styled.div`
  padding-top: 50px;
  width: 95%;
  margin: 0 auto;
`;
interface BoardFormValues {
  board_title: string;
  board_limit: number;
}
export const RetroBody = () => {
  const [boards, setBoards] = useState<Board[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BoardFormValues>();

  useEffect(() => {
    const boardsCollectionSnap = onSnapshot(
      collection(firestore, "boards"),
      (snapshot) => {
        const payload = snapshot.docs.map((doc) => {
          return { ...doc.data(), board_id: doc.id };
        }) as Board[];
        setBoards(payload);
        setLoading(false);
      }
    );
    return boardsCollectionSnap;
  }, []);
  const {
    isOpen: isBoardModalOpen,
    onClose: closeBoardModal,
    onOpen: openBoardModal,
  } = useDisclosure();

  const handleCreateBoard = async (data: BoardFormValues) => {
    try {
      await addDoc(boardsRef, {
        ...data,
        board_id: uuidv4(),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const renderBoardCards = () => {
    return loading ? (
      <BoardSkeleton amount={5} />
    ) : (
      boards?.map((board) => {
        return (
          <BoardCard
            key={board.board_id}
            to={`/board/${board.board_id}`}
            header={board.board_title}
            boardId={board.board_id}
          />
        );
      })
    );
  };

  return (
    <>
      <BoardsContainer>
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(5, 1fr)",
          }}
          justifyContent="center"
          gap={6}
        >
          {renderBoardCards()}
          <Box>
            <CreateBoardModal
              modalTitle="Create Board"
              isOpen={isBoardModalOpen}
              onOpen={openBoardModal}
              onClose={closeBoardModal}
              triggerName="Create"
            >
              <form onSubmit={handleSubmit(handleCreateBoard)}>
                <Stack spacing={3}>
                  <InputGroup>
                    <Input
                      type="text"
                      placeholder="Board Title"
                      {...register("board_title")}
                    />
                  </InputGroup>
                  <InputGroup>
                    <Input
                      type="number"
                      min={2}
                      {...register("board_limit")}
                      placeholder="Number of cards"
                    />
                  </InputGroup>
                  <div>
                    <Button type="submit">Create Board</Button>
                  </div>
                </Stack>
              </form>
            </CreateBoardModal>
          </Box>
        </Grid>
      </BoardsContainer>
    </>
  );
};
