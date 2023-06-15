import { Grid } from "@chakra-ui/layout";
import { Heading } from "@chakra-ui/react";
import BoardCard from "components/RetroHome/BoardCard";
import { firestore } from "configs/firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
import { useWorkpaceId } from "context/RetroBoard/RetroBoardContext";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore"; // import Loading from "./Loader";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { MAX_SCREEN_WIDTH } from "utils/constants";
import { Collection } from "utils/firebaseCollection";
import { BoardWithDocId, Workspace } from "utils/interfaces";

const BoardsContainer = styled.div`
  margin: 0 auto;
  max-width: ${MAX_SCREEN_WIDTH};
  padding: 2rem;
  width: 100%;
`;

export const RetroWorkspaceBoards = () => {
  const [boards, setBoards] = useState<BoardWithDocId[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [workspace, setWorkspace] = useState<Workspace>();
  const { member } = useAuthContext();
  const workspaceId = useWorkpaceId();

  useEffect(() => {
    if (member) {
      const q = query(
        collection(firestore, "boards"),
        where("workspaceId", "==", workspaceId),
        orderBy("createdAt", "desc")
      );

      const workspaces = member.workspaces;
      const currentWorkspace = workspaces.filter(
        (workspace) => workspace === workspaceId
      );
      const fetchCurrentWorkspace = getDoc(
        doc(firestore, Collection.Workspaces, currentWorkspace[0])
      );

      Promise.resolve(fetchCurrentWorkspace).then((workspace) => {
        console.log(workspace.data());
        setWorkspace(workspace.data() as Workspace);
      });

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

  return (
    <BoardsContainer>
      <Heading as="h4" marginBottom={"1rem"} size="md">
        {workspace?.workspaceTitle}
      </Heading>
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
        {boards?.map((board) => {
          return <BoardCard key={board.boardId} board={board} />;
        })}
      </Grid>
    </BoardsContainer>
  );
};
