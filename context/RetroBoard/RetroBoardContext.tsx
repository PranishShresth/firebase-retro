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
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { itemsRef, listsRef } from "utils/firebaseCollection";
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

  useEffect(() => {
    (async () => {
      const boardsRef = query(
        collection(firestore, "boards"),
        orderBy("createdAt", "asc")
      );
      const boardSnapshot = await getDocs(boardsRef);
      const boards = boardSnapshot.docs.map((doc) => {
        return { ...doc.data() } as Board;
      });
      dispatch(updateBoards(boards));
    })();
  }, []);

  useEffect(() => {
    async function fetchCurrentBoard() {
      dispatch(updateBoardToPending());
      const listsQuery = query(listsRef, where("board_id", "==", boardId));
      const itemsQuery = query(itemsRef, where("board_id", "==", boardId));
      const [listsData, itemsData, boardData] = await Promise.all([
        getDocs(listsQuery) ?? [],
        getDocs(itemsQuery) ?? [],
        getDoc(doc(firestore, "boards", boardId) ?? undefined),
      ]);

      const payload = {
        board: boardData.data() as Board,
        items: itemsData.docs.map((x) => x.data()) as Item[],
        lists: listsData.docs.map((x) => x.data()) as List[],
      };
      dispatch(updateBoard(payload))

    }
    fetchCurrentBoard();
  }, [boardId, dispatch]);

  // lists subscription

  useEffect(() => {
    const q = query(
      collection(firestore, "lists"),
      where("board_id", "==", boardId)
    );

    const listsCollectionSnap = onSnapshot(q, (snapshot) => {
      const payload = snapshot.docs.map((doc) => {
        return doc.data() as List
      });
      dispatch(updateLists(payload));
    });
    return listsCollectionSnap;
  }, [boardId]);

  // items subscription
  useEffect(() => {
    const q = query(
      collection(firestore, "items"),
      where("board_id", "==", boardId)
    );

    const itemsCollectionSnap = onSnapshot(q, (snapshot) => {
      const payload = snapshot.docs.map((doc) => {
        return doc.data() as Item
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
