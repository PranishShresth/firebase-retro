import { firestore } from "configs/firebase/firestore";
import { useAuthContext } from "context/Auth/AuthContext";
import { doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  Collection,
  itemsCollection,
  listsCollection,
} from "utils/firebaseCollection";
import { Board, Item, List, Member, Workspace } from "utils/interfaces";
import {
  initialState,
  RetroBoardState,
  rootReducer,
  updateBoard,
  updateItems,
  updateLists,
  updateWorkspace,
} from "./reducers";

const RetroBoardContext = createContext<{
  board: RetroBoardState;
  dispatch: Dispatch<any>;
  workspaceId: string | null;
}>({
  board: initialState,
  dispatch: () => null,
  workspaceId: null,
});

export const useBoard = () => {
  const ctx = useContext(RetroBoardContext);
  return ctx.board;
};

export const useDispatch = () => {
  return useContext(RetroBoardContext).dispatch;
};

export const useBoardPref = () => {
  const ctx = useContext(RetroBoardContext);
  return ctx.board.boardPref;
};

export const useWorkpaceId = () => {
  return useContext(RetroBoardContext).workspaceId;
};

export const RetroBoardProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const boardId = "" + router.query.boardId;
  const existingWorkspaceId = router.query.workspaceId
    ? "" + router.query.workspaceId
    : null;

  const { member } = useAuthContext();
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const [workspaceId, setWorkspaceId] = useState<string | null>(
    existingWorkspaceId
  );
  const [members, setMembers] = useState<Member[] | null>(null);

  const ctx = useMemo(
    () => ({ board: state, workspaceId, dispatch }),
    [state, workspaceId, dispatch]
  );

  useEffect(() => {
    const unsubBoard = onSnapshot(
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

    return unsubBoard;
  }, [boardId, dispatch, member, members, workspaceId]);

  useEffect(() => {
    if (workspaceId && member) {
      const q = doc(firestore, Collection.Workspaces, workspaceId);
      getDoc(q).then((snap) => {
        const workspace = snap.data() as Workspace;
        const isMember = workspace.members.find(
          (m) => m.userId === member.userId
        );
        if (isMember) {
          dispatch(updateWorkspace(workspace));
          return setMembers(workspace.members);
        }
        dispatch(updateBoard({ board: {} as Board }));
        setMembers(null);
      });
    }
  }, [workspaceId, member]);

  // lists subscription
  useEffect(() => {
    const q = query(listsCollection, where("boardId", "==", boardId));

    const unsubListSnap = onSnapshot(q, (snapshot) => {
      const payload = snapshot.docs.map((doc) => {
        return doc.data() as List;
      });
      dispatch(updateLists(payload));
    });

    return unsubListSnap;
  }, [boardId]);

  // items subscription
  useEffect(() => {
    const q = query(itemsCollection, where("boardId", "==", boardId));

    const unsubItemsSnap = onSnapshot(q, (snapshot) => {
      const payload = snapshot.docs.map((doc) => {
        return doc.data() as Item;
      });
      dispatch(updateItems(payload));
    });

    return unsubItemsSnap;
  }, [boardId]);

  return (
    <RetroBoardContext.Provider value={ctx}>
      {children}
    </RetroBoardContext.Provider>
  );
};
