import React, { useEffect } from "react";

import { Grid, Stack } from "@chakra-ui/layout";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input, InputGroup, Button, useToast, Box } from "@chakra-ui/react";
import BoardCard from "./BoardCard";
import styled from "styled-components";
import CreateBoardModal from "components/Modal/Modal";
import { firestore } from "configs/firebase/firestore";
import { collection, getDocs, doc, setDoc } from "firebase/firestore"; // import Loading from "./Loader";
import { useForm } from "react-hook-form";

const BoardsContainer = styled.div`
  padding-top: 50px;
  width: 95%;
  margin: 0 auto;
`;
interface BoardValues {
  board_title: string;
  board_limit: number;
}
export const RetroBody = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BoardValues>();

  const sds = useEffect(() => {
    async function fetchBoards() {
      const boardsQuery = await getDocs(collection(firestore, "boards"));
      console.log(boardsQuery.docs);
    }
    fetchBoards();
  }, []);
  const {
    isOpen: isBoardModalOpen,
    onClose: closeBoardModal,
    onOpen: openBoardModal,
  } = useDisclosure();

  const handleCreateBoard = async (data: BoardValues) => {
    try {
      await setDoc(doc(firestore, "boards"), data);
    } catch {}
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
          {/* {boards?.map((board) => {
            return (
              <BoardCard
                to={`/board/${board._id}`}
                header={board.board_title}
                boardId={board._id}
              />
            );
          })} */}
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
