import React, { useEffect, useState } from "react";
import { Grid, Stack } from "@chakra-ui/layout";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input, InputGroup, Button, Box } from "@chakra-ui/react";
import BoardCard from "./BoardCard";
import styled from "styled-components";
import { Modal as CreateBoardModal } from "components/Modal";
import { firestore } from "configs/firebase/firestore";
import {
  collection,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  doc,
  setDoc,
  where,
} from "firebase/firestore"; // import Loading from "./Loader";
import { Controller, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { BoardWithDocId, Preference } from "utils/interfaces";
import Skeleton from "components/Loader/Skeleton";
import { ColourPicker } from "components/ColourPicker";
import { useAuthContext } from "context/Auth/AuthContext";

const BoardsContainer = styled.div`
  padding-top: 50px;
  width: 95%;
  margin: 0 auto;
  max-width: 1600px;
`;

interface BoardFormValues {
  boardColour: string;
  boardTitle: string;
}

const defaultPrefs: Preference = {
  permissionLevel: "private",
  customBackground: false,
  closed: false,
};

export const RetroBody = () => {
  const [boards, setBoards] = useState<BoardWithDocId[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const { userDetails } = useAuthContext();

  const {
    isOpen: isBoardModalOpen,
    onClose: closeBoardModal,
    onOpen: openBoardModal,
  } = useDisclosure();

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<BoardFormValues>({
    defaultValues: {
      boardColour: "#000000",
    },
  });

  useEffect(() => {
    if (userDetails) {
      const q = query(
        collection(firestore, "boards"),
        where("createdBy.userId", "==", userDetails.userId),
        orderBy("createdAt", "desc")
      );

      const boardsCollectionSnap = onSnapshot(q, (snapshot) => {
        const payload = snapshot.docs.map((doc) => {
          return { ...doc.data(), doc_id: doc.id } as BoardWithDocId;
        });
        setBoards(payload);
        setLoading(false);
      });
      return boardsCollectionSnap;
    }
  }, [userDetails]);

  const handleCreateBoard = async (data: BoardFormValues) => {
    try {
      closeBoardModal();
      reset();
      const doc_id = uuidv4();
      const ref = doc(firestore, "boards", doc_id);

      await setDoc(ref, {
        ...data,
        boardId: doc_id,
        prefs: defaultPrefs,
        createdBy: userDetails,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <BoardsContainer>
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
            xl: "repeat(5, 1fr)",
          }}
          justifyContent="center"
          gap={6}
        >
          <Box minHeight="90px">
            <CreateBoardModal
              createBoard
              isOpen={isBoardModalOpen}
              modalTitle="New Board"
              onClose={closeBoardModal}
              onOpen={openBoardModal}
              triggerName="New Board"
            >
              <form onSubmit={handleSubmit(handleCreateBoard)}>
                <Stack spacing={3}>
                  <div>
                    <span>Board Title:</span>
                    <InputGroup marginTop="4px">
                      <Input
                        placeholder="Board Title"
                        required
                        type="text"
                        {...register("boardTitle")}
                      />
                    </InputGroup>
                  </div>

                  <div>
                    <span>Colour:</span>
                    <Controller
                      control={control}
                      name="boardColour"
                      render={({ field }) => <ColourPicker field={field} />}
                    />
                  </div>
                  <div>
                    <Button marginBottom="12px" type="submit">
                      Create Board
                    </Button>
                  </div>
                </Stack>
              </form>
            </CreateBoardModal>
          </Box>
          {loading ? (
            <Skeleton amount={6} height="90px" width="100%" />
          ) : (
            boards?.map((board) => {
              return <BoardCard key={board.boardId} board={board} />;
            })
          )}
        </Grid>
      </BoardsContainer>
    </>
  );
};
