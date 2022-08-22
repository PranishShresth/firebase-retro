import React, { useEffect, useState } from "react";
import { Grid, Stack } from "@chakra-ui/layout";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input, InputGroup, Button, Box } from "@chakra-ui/react";
import { darken } from "@chakra-ui/theme-tools";
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
import { FaChalkboard } from "react-icons/fa";
import {
  TemplateSelect,
  TEMPLATE_OPTIONS,
} from "components/TemplateSelect/TemplateSelect";
import { AUSTRALIA_RETRO_LISTS } from "utils/retroLists";

const BoardsContainer = styled.div`
  max-width: 1600px;
  padding-top: 1rem;
  width: 100%;
`;

interface BoardTemplate {
  label: string;
  value: string;
}
interface BoardFormValues {
  boardColour: string;
  boardTemplate: BoardTemplate;
  boardTitle: string;
}

const defaultPrefs: Preference = {
  permissionLevel: "private",
  timer: null,
  closed: false,
};

export const FIVE_MINUTES_IN_SECONDS = 300;

export const RetroBody = ({ workspaceId }: { workspaceId: string }) => {
  const [boards, setBoards] = useState<BoardWithDocId[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const { member } = useAuthContext();

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
    formState: { errors, isDirty, isValid },
  } = useForm<BoardFormValues>({
    defaultValues: {
      boardColour: "#000000",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (member) {
      const q = query(
        collection(firestore, "boards"),
        where("workspaceId", "==", workspaceId),
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
  }, [member, workspaceId]);

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
        userId: member?.userId,
        members: [member],
        workspaceId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      const isAustraliaRetro =
        data.boardTemplate && data.boardTemplate.value === "australiaRetro";

      if (isAustraliaRetro) {
        AUSTRALIA_RETRO_LISTS.forEach(
          async ({ listColour, listTitle }, index) => {
            const list_doc_id = uuidv4();
            const listref = doc(firestore, "lists", list_doc_id);
            await setDoc(listref, {
              listColour,
              listTitle,
              listId: list_doc_id,
              boardId: doc_id,
              listOrder: index,
              createdAt: serverTimestamp(),
            });
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
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
                      {...register("boardTitle", { required: true })}
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
                  <span>Template:</span>
                  <Controller
                    control={control}
                    defaultValue={TEMPLATE_OPTIONS[0]}
                    name="boardTemplate"
                    render={({ field }) => <TemplateSelect field={field} />}
                  />
                </div>
                <div>
                  <Button
                    backgroundColor={"#00B5AD"}
                    color={"white"}
                    disabled={!isDirty || !isValid}
                    _hover={{ backgroundColor: darken("#00B5AD", 8) }}
                    marginBottom="12px"
                    marginTop="16px"
                    type="submit"
                    width="100%"
                  >
                    Create Board&nbsp;
                    <FaChalkboard />
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
  );
};
