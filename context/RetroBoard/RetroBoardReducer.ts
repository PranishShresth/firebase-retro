import { Board, List, Item, Workspace } from "utils/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface RetroBoardState {
  board: Board;
  workspace: Workspace;
  lists: List[];
  items: Item[];
  allBoards: Board[];
  status: string;
  filterPayload: string;
}

export const initialState = {
  board: {},
  allBoards: [],
  lists: [],
  workspace: {},
  items: [],
  status: "pending",
  filterPayload: "",
} as unknown as RetroBoardState;

type ReorderItemPayload = {
  source: string;
  destination: string;
  position: number;
  itemId: string;
};

type ReorderListPayload = {
  sourceIndex: number;
  destinationIndex: number;
};

type BoardPayload = { items?: Item[]; lists?: List[]; board?: Board };

const boardSlice = createSlice({
  name: "boardReducer",
  reducers: {
    updateBoards(state, action) {
      state.allBoards = action.payload;

      state.status = "fulfilled";
    },
    updateBoard(state, action: PayloadAction<BoardPayload>) {
      const { board, lists, items } = action.payload;
      if (board) {
        state.board = board;
      }
      if (items) {
        state.items = items;
      }
      if (lists) {
        state.lists = lists;
      }

      state.status = "fulfilled";
    },
    reorderItem(state, action: PayloadAction<ReorderItemPayload>) {
      const { source, destination, itemId, position } = action.payload;
      const itemIdx = state.items.findIndex((s) => s.itemId === itemId);
      const item = state.items[itemIdx];
      if (source === destination) {
        item.itemOrder = position;
      } else {
        const item = state.items[itemIdx];
        item.itemOrder = position;
        item.listId = destination;
      }
    },
    reorderList(state, action: PayloadAction<ReorderListPayload>) {
      const { sourceIndex, destinationIndex } = action.payload;
      const lists = state.lists.sort((a, b) => a.listOrder - b.listOrder);
      const sourceList = lists[sourceIndex];
      const destList = lists[destinationIndex];

      [sourceList.listOrder, destList.listOrder] = [
        destList.listOrder,
        sourceList.listOrder,
      ];
    },

    updateLists(state, action: PayloadAction<List[]>) {
      state.lists = action.payload;
    },
    updateItems(state, action: PayloadAction<Item[]>) {
      state.items = action.payload;
    },
    updateWorkspace(state, action: PayloadAction<Workspace>) {
      state.workspace = action.payload;
    },
    updateBoardToPending(state) {
      state.status = "pending";
    },
    setFilterPayload(state, action: PayloadAction<string>) {
      state.filterPayload = action.payload;
    },
  },
  initialState,
});

const {
  updateBoard,
  updateBoardToPending,
  updateBoards,
  updateItems,
  updateLists,
  updateWorkspace,
  reorderItem,
  reorderList,
  setFilterPayload,
} = boardSlice.actions;
const retroBoardReducer = boardSlice.reducer;

export {
  updateBoard,
  updateBoardToPending,
  updateBoards,
  updateItems,
  updateLists,
  updateWorkspace,
  reorderItem,
  reorderList,
  setFilterPayload,
  retroBoardReducer,
};

// export {retroBoardReducer:boardSlice.reducers}
// export const updateWorkspace = (payload: Workspace): ActionTypes => ({
//   type: FETCH_WORKSPACE_FULFILLED,
//   payload,
// });

// export const updateBoardToPending = (): ActionTypes => ({
//   type: FETCH_BOARD_REQUESTED,
// });

// export const setFilterPayload = (filterString: string): ActionTypes => ({
//   type: SET_FILTER_ITEM_PAYLOAD,
//   payload: filterString,
// });

// export const updateBoards = (payload: Board[]): ActionTypes => ({
//   type: FETCH_BOARDS_FULFILLED,
//   payload,
// });

// export const updateBoard = (payload: BoardPayload): ActionTypes => ({
//   type: FETCH_BOARD_FULFILLED,
//   payload,
// });

// export const reorderItem = (payload: ReorderItemPayload): ActionTypes => ({
//   type: REORDER_ITEM_REQUESTED,
//   payload,
// });

// export const reorderList = (payload: ReorderListPayload): ActionTypes => ({
//   type: REORDER_LIST_REQUESTED,
//   payload,
// });

// export const updateLists = (payload: List[]): ActionTypes => ({
//   type: FETCH_LISTS_FULFILLED,
//   payload,
// });

// export const updateItems = (payload: Item[]): ActionTypes => ({
//   type: FETCH_ITEMS_FULFILLED,
//   payload,
// });

// export const updateWorkspace = (payload: Workspace): ActionTypes => ({
//   type: FETCH_WORKSPACE_FULFILLED,
//   payload,
// });

// export const updateBoardToPending = (): ActionTypes => ({
//   type: FETCH_BOARD_REQUESTED,
// });

// export const setFilterPayload = (filterString: string): ActionTypes => ({
//   type: SET_FILTER_ITEM_PAYLOAD,
//   payload: filterString,
// });
