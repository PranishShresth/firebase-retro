import { useDisclosure } from "@chakra-ui/hooks";
import { Grid, Stack } from "@chakra-ui/layout";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  useColorMode,
} from "@chakra-ui/react";
import { darken } from "@chakra-ui/theme-tools";
import { ColourPicker } from "components/ColourPicker";
import Skeleton from "components/Loader/Skeleton";
import { Modal as CreateBoardModal } from "components/Modal";
import {
  TEMPLATE_OPTIONS,
  TemplateSelect,
} from "components/TemplateSelect/TemplateSelect";
import { firestore } from "configs/firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore"; // import Loading from "./Loader";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaChalkboard } from "react-icons/fa";
import { FiChevronsRight } from "react-icons/fi";
import styled from "styled-components";
import { MAX_SCREEN_WIDTH } from "utils/constants";
import { BoardWithDocId, Preference } from "utils/interfaces";
import {
  AUSTRALIA_DEV_RETRO,
  AUSTRALIA_TOWN_HALL,
  CustomBoard,
} from "utils/retroLists";
import { v4 as uuidv4 } from "uuid";
import BoardCard from "./BoardCard";

const BoardsContainer = styled.div`
  max-width: ${MAX_SCREEN_WIDTH};
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
const XL_WINDOW_WIDTH_BREAKPOINT = 1279;
const LG_WINDOW_WIDTH_BREAKPOINT = 991;
const MD_WINDOW_WIDTH_BREAKPOINT = 767;
const DEFAULT_BOARDS_LIMIT = 4;

export const RetroBody = ({
  workspaceId,
  workspaceName,
}: {
  workspaceId: string;
  workspaceName: string;
}) => {
  const { colorMode } = useColorMode();
  const [boards, setBoards] = useState<BoardWithDocId[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [boardsLimit, setBoardsLimit] = useState<number>(DEFAULT_BOARDS_LIMIT);
  const { member } = useAuthContext();

  const numberOfBoardsLimit = () => {
    if (window.innerWidth > XL_WINDOW_WIDTH_BREAKPOINT) {
      setBoardsLimit(DEFAULT_BOARDS_LIMIT);
    } else if (window.innerWidth > LG_WINDOW_WIDTH_BREAKPOINT) {
      setBoardsLimit(DEFAULT_BOARDS_LIMIT - 1);
    } else if (window.innerWidth > MD_WINDOW_WIDTH_BREAKPOINT) {
      setBoardsLimit(DEFAULT_BOARDS_LIMIT - 2);
    }
  };

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
      boardColour: colorMode === "light" ? "#000000" : "#F2F2F2",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (member) {
      const q = query(
        collection(firestore, "boards"),
        where("workspaceId", "==", workspaceId),
        orderBy("createdAt", "desc"),
        limit(5)
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

  const generateCustomBoard = (board: CustomBoard[], doc_id: string) => {
    return board.forEach(async ({ listColour, listTitle }, index) => {
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
    });
  };

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
      const isAustraliaTownHall =
        data.boardTemplate && data.boardTemplate.value === "australiaTownHall";

      const isAustraliaDevRetro =
        data.boardTemplate && data.boardTemplate.value === "australiaDevRetro";

      if (isAustraliaDevRetro) {
        generateCustomBoard(AUSTRALIA_DEV_RETRO, doc_id);
      }
      if (isAustraliaTownHall) {
        generateCustomBoard(AUSTRALIA_TOWN_HALL, doc_id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    numberOfBoardsLimit();
  }, []);

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
            boards?.slice(0, boardsLimit)?.map((board) => {
              return <BoardCard key={board.boardId} board={board} />;
            })
          )}
        </Grid>
      </BoardsContainer>
      {boards && boards.length > boardsLimit && (
        <Box
          fontSize="0.825rem"
          fontWeight="bold"
          textAlign="right"
          marginTop="24px"
          textDecoration="underline"
        >
          <Link href={`workspace/${workspaceId}/boards`} passHref>
            <a style={{ display: "inline-block" }}>
              <Flex alignItems="center">
                View all {workspaceName} boards <FiChevronsRight size="1rem" />
              </Flex>
            </a>
          </Link>
        </Box>
      )}
    </>
  );
};
