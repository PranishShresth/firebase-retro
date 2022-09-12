import React, {
  createContext,
  Dispatch,
  useEffect,
  useReducer,
  useContext,
  ReactNode,
  useState,
} from "react";
import { useRouter } from "next/router";
import { onSnapshot, query, doc, where, getDoc } from "firebase/firestore";
import {
  Collection,
  itemsCollection,
  listsCollection,
} from "utils/firebaseCollection";
import { firestore } from "configs/firebase/firestore";
import {
  initialState,
  RetroBoardReducer,
  RetroBoardState,
  updateBoard,
  updateItems,
  updateLists,
} from "./RetroBoardReducer";
import { Board, Item, List, Member, Workspace } from "utils/interfaces";
import { useAuthContext } from "context/Auth/AuthContext";

const RetroBoardContext = createContext<{
  board: RetroBoardState;
  dispatch: Dispatch<any>;
  workspaceId: string | null;
}>({
  board: initialState,
  dispatch: () => null,
  workspaceId: null,
});

export const useRetroContext = () => {
  return useContext(RetroBoardContext);
};

export const RetroBoardProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const boardId = "" + router.query.boardId;
  const existingWorkspaceId = router.query.workspaceId
    ? "" + router.query.workspaceId
    : null;

  const { member } = useAuthContext();
  const [state, dispatch] = useReducer(RetroBoardReducer, initialState);
  const [workspaceId, setWorkspaceId] = useState<string | null>(
    existingWorkspaceId
  );
  const [members, setMembers] = useState<Member[] | null>(null);

  useEffect(() => {
    const boardSnap = onSnapshot(
      doc(firestore, Collection.Boards, boardId),
      (snapshot) => {
        const board = snapshot.data() as Board;
        if (!workspaceId) {
          setWorkspaceId(board.workspaceId);
        }
        if (members) {
          dispatch(updateBoard({ board: { ...board, members: members } }));
        }
      }
    );

    return boardSnap;
  }, [boardId, dispatch, member, members, workspaceId]);

  useEffect(() => {
    if (workspaceId && member) {
      const q = doc(firestore, Collection.Workspaces, workspaceId);
      getDoc(q).then((snap) => {
        const { members } = snap.data() as Workspace;
        const isMember = members.find((m) => m.userId === member.userId);
        if (isMember) {
          return setMembers(members);
        }
        dispatch(updateBoard({ board: {} as Board }));
        setMembers(null);
      });
    }
  }, [workspaceId, member]);

  // lists subscription
  useEffect(() => {
    const q = query(listsCollection, where("boardId", "==", boardId));

    const listsCollectionSnap = onSnapshot(q, (snapshot) => {
      const payload = snapshot.docs.map((doc) => {
        return doc.data() as List;
      });
      dispatch(updateLists(payload));
    });
    return listsCollectionSnap;
  }, [boardId]);

  // items subscription
  useEffect(() => {
    const q = query(itemsCollection, where("boardId", "==", boardId));

    const itemsCollectionSnap = onSnapshot(q, (snapshot) => {
      const payload = snapshot.docs.map((doc) => {
        return doc.data() as Item;
      });
      dispatch(updateItems(payload));
    });
    return itemsCollectionSnap;
  }, [boardId]);

  return (
    <RetroBoardContext.Provider value={{ board: state, workspaceId, dispatch }}>
      {children}
    </RetroBoardContext.Provider>
  );
};
