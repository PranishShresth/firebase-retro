import React, {
  createContext,
  Dispatch,
  useEffect,
  useReducer,
  useContext,
  ReactNode,
} from "react";
import { useRouter } from "next/router";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { itemsCollection, listsCollection } from "utils/firebaseCollection";
import { firestore } from "configs/firebase/firestore";
import {
  initialState,
  RetroBoardReducer,
  RetroBoardState,
  updateBoard,
  updateBoards,
  updateBoardToPending,
  updateItems,
  updateLists,
} from "./RetroBoardReducer";
import { Board, Item, List } from "utils/interfaces";
import { useAuthContext } from "context/Auth/AuthContext";

const RetroBoardContext = createContext<{
  board: RetroBoardState;
  dispatch: Dispatch<any>;
}>({
  board: initialState,
  dispatch: () => null,
});

export const useRetroContext = () => {
  return useContext(RetroBoardContext);
};

export const RetroBoardProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const boardId = "" + router.query.boardId;
  const [state, dispatch] = useReducer(RetroBoardReducer, initialState);
  const { member } = useAuthContext();

  useEffect(() => {
    (async () => {
      if (member) {
        const boardsRef = query(
          collection(firestore, "boards"),
          where("createdBy.userId", "==", member.userId),
          orderBy("createdAt", "desc")
        );
        const boardSnapshot = await getDocs(boardsRef);
        const boards = boardSnapshot.docs.map((doc) => {
          return { ...doc.data() } as Board;
        });
        dispatch(updateBoards(boards));
      }
    })();
  }, [member]);

  useEffect(() => {
    dispatch(updateBoardToPending());
    const q = query(
      collection(firestore, "boards"),
      where("board_id", "==", boardId)
    );

    const boardCollectionSnap = onSnapshot(q, (snapshot) => {
      const payload = snapshot.docs.map((doc) => {
        return doc.data() as Board;
      });
      dispatch(updateBoard({ board: payload[0] }));
    });
    return boardCollectionSnap;
  }, [boardId, dispatch]);

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
    <RetroBoardContext.Provider value={{ board: state, dispatch }}>
      {children}
    </RetroBoardContext.Provider>
  );
};
